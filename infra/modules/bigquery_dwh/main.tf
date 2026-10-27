resource "google_bigquery_dataset" "raw" {
  dataset_id                 = "raw"
  friendly_name              = "Raw Ingestion Layer"
  description                = "Raw streaming events and Dead-Letter Queue (DLQ) tables"
  location                   = var.region
  delete_contents_on_destroy = true
  labels                     = merge(var.common_labels, { cost_tier = "serverless", layer = "raw" })
}

resource "google_bigquery_dataset" "staging" {
  dataset_id                 = "staging"
  friendly_name              = "Staging & BigLake Layer"
  description                = "Cleaned intermediate views and BigLake external tables"
  location                   = var.region
  delete_contents_on_destroy = true
  labels                     = merge(var.common_labels, { cost_tier = "serverless", layer = "staging" })
}

resource "google_bigquery_dataset" "marts" {
  dataset_id                 = "marts"
  friendly_name              = "Curated Star Schema Marts"
  description                = "Consumption-ready dimension and fact tables governed by Policy Tags"
  location                   = var.region
  delete_contents_on_destroy = true
  labels                     = merge(var.common_labels, { cost_tier = "serverless", layer = "marts" })
}

resource "google_bigquery_dataset" "ml" {
  dataset_id                 = "ml"
  friendly_name              = "BigQuery ML Models & Predictions"
  description                = "Customer churn classification and demand forecasting models"
  location                   = var.region
  delete_contents_on_destroy = true
  labels                     = merge(var.common_labels, { cost_tier = "serverless", layer = "ml" })
}

# Data Catalog Taxonomy & Policy Tag for Column-Level Security (PDE Governance Topic)
resource "google_data_catalog_taxonomy" "pii_taxonomy" {
  provider               = google-beta
  region                 = var.region
  display_name           = "${var.name_prefix}-pii-classification"
  description            = "Taxonomy for BigQuery Column-Level Security and Dynamic Data Masking"
  activated_policy_types = ["FINE_GRAINED_ACCESS_CONTROL"]
}

resource "google_data_catalog_policy_tag" "pii_high" {
  provider     = google-beta
  taxonomy     = google_data_catalog_taxonomy.pii_taxonomy.id
  display_name = "PII_HIGH_SENSITIVITY"
  description  = "Direct customer identifiers (Email, Phone) requiring explicit Fine-Grained Reader role"
}

# Contract 2.1: Partitioned & Clustered Streaming Events Table
resource "google_bigquery_table" "events_stream" {
  dataset_id          = google_bigquery_dataset.raw.dataset_id
  table_id            = "events_stream"
  deletion_protection = false
  require_partition_filter = true
  labels              = merge(var.common_labels, { cost_tier = "serverless" })

  time_partitioning {
    type  = "DAY"
    field = "event_timestamp"
  }

  clustering = ["event_type", "user_id"]

  schema = jsonencode([
    { name = "event_id", type = "STRING", mode = "REQUIRED", description = "UUIDv4 event identifier" },
    { name = "event_timestamp", type = "TIMESTAMP", mode = "REQUIRED", description = "UTC event occurrence time" },
    { name = "ingestion_timestamp", type = "TIMESTAMP", mode = "REQUIRED", description = "Beam processing time" },
    { name = "user_id", type = "STRING", mode = "REQUIRED", description = "Customer identifier" },
    { name = "session_id", type = "STRING", mode = "NULLABLE", description = "Browser/App session ID" },
    { name = "event_type", type = "STRING", mode = "REQUIRED", description = "PAGE_VIEW | ADD_TO_CART | CHECKOUT | GPS_PING" },
    { name = "order_amount", type = "FLOAT64", mode = "NULLABLE", description = "Transaction value (>= 0)" },
    { name = "customer_email", type = "STRING", mode = "NULLABLE", description = "Customer email address" },
    { name = "device_os", type = "STRING", mode = "NULLABLE", description = "Client OS" },
    { name = "geo_lat", type = "FLOAT64", mode = "NULLABLE", description = "Latitude" },
    { name = "geo_lon", type = "FLOAT64", mode = "NULLABLE", description = "Longitude" }
  ])
}

# Contract 2.2: Dead-Letter Queue (DLQ) Malformed Events Table
resource "google_bigquery_table" "malformed_events" {
  dataset_id          = google_bigquery_dataset.raw.dataset_id
  table_id            = "malformed_events"
  deletion_protection = false
  labels              = merge(var.common_labels, { cost_tier = "serverless" })

  time_partitioning {
    type  = "DAY"
    field = "failed_at"
  }

  schema = jsonencode([
    { name = "raw_payload", type = "STRING", mode = "REQUIRED", description = "Unparseable or invalid JSON string" },
    { name = "error_reason", type = "STRING", mode = "REQUIRED", description = "Validation failure message" },
    { name = "pipeline_step", type = "STRING", mode = "REQUIRED", description = "Transform stage that rejected the record" },
    { name = "failed_at", type = "TIMESTAMP", mode = "REQUIRED", description = "UTC rejection timestamp" }
  ])
}

# Contract 2.3: Customer Dimension Table with Column-Level Policy Tag
resource "google_bigquery_table" "dim_customers" {
  dataset_id          = google_bigquery_dataset.marts.dataset_id
  table_id            = "dim_customers"
  deletion_protection = false
  clustering          = ["region", "loyalty_tier"]
  labels              = merge(var.common_labels, { cost_tier = "serverless" })

  schema = jsonencode([
    { name = "user_id", type = "STRING", mode = "REQUIRED" },
    {
      name        = "customer_email"
      type        = "STRING"
      mode        = "NULLABLE"
      policyTags  = { names = [google_data_catalog_policy_tag.pii_high.id] }
    },
    { name = "loyalty_tier", type = "STRING", mode = "NULLABLE" },
    { name = "region", type = "STRING", mode = "NULLABLE" },
    { name = "updated_at", type = "TIMESTAMP", mode = "REQUIRED" }
  ])
}

# Contract 2.4: Daily Revenue Fact Table
resource "google_bigquery_table" "fact_daily_revenue" {
  dataset_id          = google_bigquery_dataset.marts.dataset_id
  table_id            = "fact_daily_revenue"
  deletion_protection = false
  labels              = merge(var.common_labels, { cost_tier = "serverless" })

  time_partitioning {
    type  = "DAY"
    field = "order_date"
  }

  schema = jsonencode([
    { name = "order_date", type = "DATE", mode = "REQUIRED" },
    { name = "total_orders", type = "INT64", mode = "REQUIRED" },
    { name = "total_revenue", type = "FLOAT64", mode = "REQUIRED" },
    { name = "unique_customers", type = "INT64", mode = "REQUIRED" },
    { name = "refreshed_at", type = "TIMESTAMP", mode = "REQUIRED" }
  ])
}
