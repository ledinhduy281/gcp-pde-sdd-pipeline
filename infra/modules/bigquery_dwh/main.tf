resource "google_bigquery_dataset" "raw" {
  dataset_id                 = "raw"
  friendly_name              = "Jinder Raw Ingestion Layer"
  description                = "Raw Jinder streaming engagement events (Views, Saves, Ignores, Applications) and DLQ quarantine"
  location                   = var.region
  delete_contents_on_destroy = true
  labels                     = merge(var.common_labels, { cost_tier = "serverless", layer = "raw" })
}

resource "google_bigquery_dataset" "staging" {
  dataset_id                 = "staging"
  friendly_name              = "Jinder Staging & BigLake Layer"
  description                = "Normalized Australian & International Jobs/Talents via BigLake Parquet and Dataform views"
  location                   = var.region
  delete_contents_on_destroy = true
  labels                     = merge(var.common_labels, { cost_tier = "serverless", layer = "staging" })
}

resource "google_bigquery_dataset" "marts" {
  dataset_id                 = "marts"
  friendly_name              = "Jinder Star Schema Marts"
  description                = "Zero-PII governed dimension and fact tables (dim_customers/seekers, dim_jobs, fact_jinder_applications, fact_daily_revenue)"
  location                   = var.region
  delete_contents_on_destroy = true
  labels                     = merge(var.common_labels, { cost_tier = "serverless", layer = "marts" })
}

resource "google_bigquery_dataset" "ml" {
  dataset_id                 = "ml"
  friendly_name              = "Jinder BigQuery ML Models"
  description                = "Shortlist probability classification (F-01..F-06 features) and demand forecasting models"
  location                   = var.region
  delete_contents_on_destroy = true
  labels                     = merge(var.common_labels, { cost_tier = "serverless", layer = "ml" })
}

# Data Catalog Taxonomy & Policy Tag enforcing Jinder REQ-A07 Zero-PII Governance
resource "google_data_catalog_taxonomy" "pii_taxonomy" {
  provider               = google-beta
  region                 = var.region
  display_name           = "${var.name_prefix}-jinder-zero-pii"
  description            = "Enforces Jinder REQ-A07 Zero-PII rule: hides legal_name, customer_email, phone, cv_raw_text from employer queries"
  activated_policy_types = ["FINE_GRAINED_ACCESS_CONTROL"]
}

resource "google_data_catalog_policy_tag" "pii_high" {
  provider     = google-beta
  taxonomy     = google_data_catalog_taxonomy.pii_taxonomy.id
  display_name = "PII_HIGH_SENSITIVITY"
  description  = "Direct candidate identifiers scrubbed from Employer/HR views per Jinder REQ-A07"
}

# Table 1: Partitioned & Clustered Streaming Events Table (Jinder Engagement & Applications)
resource "google_bigquery_table" "events_stream" {
  dataset_id               = google_bigquery_dataset.raw.dataset_id
  table_id                 = "events_stream"
  deletion_protection      = false
  require_partition_filter = true
  labels                   = merge(var.common_labels, { cost_tier = "serverless" })

  time_partitioning {
    type  = "DAY"
    field = "event_timestamp"
  }

  clustering = ["event_type", "user_id"]

  schema = jsonencode([
    { name = "event_id", type = "STRING", mode = "REQUIRED", description = "UUIDv4 event identifier" },
    { name = "event_timestamp", type = "TIMESTAMP", mode = "REQUIRED", description = "UTC event occurrence time" },
    { name = "ingestion_timestamp", type = "TIMESTAMP", mode = "REQUIRED", description = "Beam processing time" },
    { name = "user_id", type = "STRING", mode = "REQUIRED", description = "Jinder Seeker ID / Candidate Alias" },
    { name = "session_id", type = "STRING", mode = "NULLABLE", description = "App session ID" },
    { name = "job_id", type = "STRING", mode = "NULLABLE", description = "Target Australian/ICT Job ID" },
    { name = "anzsco_code", type = "STRING", mode = "NULLABLE", description = "6-digit Australian ANZSCO occupation code" },
    { name = "event_type", type = "STRING", mode = "REQUIRED", description = "PAGE_VIEW | ADD_TO_CART | CHECKOUT | GPS_PING | JOB_VIEW | JOB_SAVE | JOB_IGNORE | JOB_APPLY" },
    { name = "order_amount", type = "FLOAT64", mode = "NULLABLE", description = "Annualized salary / transaction value (>= 0)" },
    { name = "frs_score", type = "FLOAT64", mode = "NULLABLE", description = "Jinder Formula F-05 Feed Ranking Score (0..100)" },
    { name = "smf_score", type = "FLOAT64", mode = "NULLABLE", description = "Jinder Formula F-01 Skill Match Frequency (0..100)" },
    { name = "gsi_score", type = "FLOAT64", mode = "NULLABLE", description = "Jinder Formula F-02 Gap Severity Index (0..100)" },
    { name = "tss_score", type = "FLOAT64", mode = "NULLABLE", description = "Jinder Formula F-06 Talent Search Score (0..100)" },
    { name = "customer_email", type = "STRING", mode = "NULLABLE", description = "Candidate email address (PII)" },
    { name = "device_os", type = "STRING", mode = "NULLABLE", description = "Work mode / Client OS" },
    { name = "geo_lat", type = "FLOAT64", mode = "NULLABLE", description = "Latitude" },
    { name = "geo_lon", type = "FLOAT64", mode = "NULLABLE", description = "Longitude" }
  ])
}

# Table 2: Dead-Letter Queue (DLQ) Malformed Events & Discrepancy Quarantine Table
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
    { name = "raw_payload", type = "STRING", mode = "REQUIRED", description = "Unparseable JSON or quarantined Jinder job/event" },
    { name = "error_reason", type = "STRING", mode = "REQUIRED", description = "Validation failure message (e.g. NEGATIVE_SALARY, >=3_DISCREPANCY_REPORTS)" },
    { name = "pipeline_step", type = "STRING", mode = "REQUIRED", description = "Transform stage that rejected the record" },
    { name = "failed_at", type = "TIMESTAMP", mode = "REQUIRED", description = "UTC rejection timestamp" }
  ])
}

# Table 3: Jinder Seeker / Customer Dimension Table with Zero-PII Policy Tags (REQ-A07)
resource "google_bigquery_table" "dim_customers" {
  dataset_id          = google_bigquery_dataset.marts.dataset_id
  table_id            = "dim_customers"
  deletion_protection = false
  clustering          = ["region", "loyalty_tier"]
  labels              = merge(var.common_labels, { cost_tier = "serverless" })

  schema = jsonencode([
    { name = "user_id", type = "STRING", mode = "REQUIRED", description = "Seeker ID" },
    { name = "alias", type = "STRING", mode = "NULLABLE", description = "Public anonymized alias shown to Employers (REQ-A07)" },
    {
      name        = "customer_email"
      type        = "STRING"
      mode        = "NULLABLE"
      description = "Protected by Policy Tag PII_HIGH_SENSITIVITY"
      policyTags  = { names = [google_data_catalog_policy_tag.pii_high.id] }
    },
    { name = "origin_country", type = "STRING", mode = "NULLABLE", description = "Candidate origin country (e.g. Vietnam, Australia)" },
    { name = "target_anzsco_code", type = "STRING", mode = "NULLABLE", description = "Target 6-digit ANZSCO occupation code" },
    { name = "years_experience", type = "FLOAT64", mode = "NULLABLE", description = "Verified years of experience" },
    { name = "loyalty_tier", type = "STRING", mode = "NULLABLE", description = "Seniority level (Intern..Principal)" },
    { name = "region", type = "STRING", mode = "NULLABLE", description = "Preferred Australian city/state" },
    { name = "updated_at", type = "TIMESTAMP", mode = "REQUIRED" }
  ])
}

# Table 4: Jinder Jobs Dimension Table (Normalized Australian & Synthetic Jobs)
resource "google_bigquery_table" "dim_jobs" {
  dataset_id          = google_bigquery_dataset.marts.dataset_id
  table_id            = "dim_jobs"
  deletion_protection = false
  clustering          = ["category", "anzsco_code"]
  labels              = merge(var.common_labels, { cost_tier = "serverless" })

  schema = jsonencode([
    { name = "job_id", type = "STRING", mode = "REQUIRED" },
    { name = "title", type = "STRING", mode = "REQUIRED" },
    { name = "company", type = "STRING", mode = "REQUIRED" },
    { name = "category", type = "STRING", mode = "REQUIRED", description = "ICT Domain / Australian Sector" },
    { name = "anzsco_code", type = "STRING", mode = "REQUIRED", description = "6-digit ANZSCO code" },
    { name = "work_mode", type = "STRING", mode = "NULLABLE", description = "Onsite | Hybrid | Remote" },
    { name = "annual_salary_min", type = "FLOAT64", mode = "NULLABLE", description = "Normalized via Jinder rule (hour*1950, day*220)" },
    { name = "annual_salary_max", type = "FLOAT64", mode = "NULLABLE", description = "Normalized via Jinder rule (hour*1950, day*220)" },
    { name = "updated_at", type = "TIMESTAMP", mode = "REQUIRED" }
  ])
}

# Table 5: Daily Platform & Application Funnel Fact Table
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
    { name = "total_orders", type = "INT64", mode = "REQUIRED", description = "Total Job Applications / Checkouts" },
    { name = "total_revenue", type = "FLOAT64", mode = "REQUIRED", description = "Total Annualized Salary / Order Value" },
    { name = "unique_customers", type = "INT64", mode = "REQUIRED", description = "Unique Active Seekers" },
    { name = "avg_frs_score", type = "FLOAT64", mode = "NULLABLE", description = "Average Jinder Feed Ranking Score (F-05)" },
    { name = "refreshed_at", type = "TIMESTAMP", mode = "REQUIRED" }
  ])
}
