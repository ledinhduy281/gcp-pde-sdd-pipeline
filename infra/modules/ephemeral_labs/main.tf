# ------------------------------------------------------------------------------
# LAB 1: Cloud SQL PostgreSQL (CDC Source Lab) — Default: count = 0 ($0)
# ------------------------------------------------------------------------------
resource "google_sql_database_instance" "oltp_postgres" {
  count               = var.enable_cloudsql_cdc ? 1 : 0
  name                = "${var.name_prefix}-oltp-pg"
  database_version    = "POSTGRES_15"
  region              = var.region
  deletion_protection = false

  settings {
    tier              = "db-f1-micro"
    availability_type = "ZONAL"
    disk_size         = 10
    disk_type         = "PD_SSD"
    user_labels       = merge(var.common_labels, { cost_tier = "ephemeral_hourly" })

    database_flags {
      name  = "cloudsql.logical_decoding"
      value = "on"
    }
  }
}

resource "google_sql_database" "ecommerce_db" {
  count    = var.enable_cloudsql_cdc ? 1 : 0
  name     = "ecommerce_oltp"
  instance = google_sql_database_instance.oltp_postgres[0].name
}

# ------------------------------------------------------------------------------
# LAB 2: Cloud Bigtable 1-Node Instance (NoSQL Row-Key Lab) — Default: count = 0 ($0)
# ------------------------------------------------------------------------------
resource "google_bigtable_instance" "realtime_serving" {
  count               = var.enable_bigtable_serving ? 1 : 0
  name                = "${var.name_prefix}-bt-instance"
  deletion_protection = false
  labels              = merge(var.common_labels, { cost_tier = "ephemeral_hourly" })

  cluster {
    cluster_id   = "${var.name_prefix}-bt-cluster-c1"
    zone         = "${var.region}-a"
    num_nodes    = 1
    storage_type = "SSD"
  }
}

resource "google_bigtable_table" "user_activity_serving" {
  count         = var.enable_bigtable_serving ? 1 : 0
  name          = "user_activity_serving"
  instance_name = google_bigtable_instance.realtime_serving[0].name

  column_family {
    family = "cf_metrics"
  }
}

resource "google_bigtable_gc_policy" "cf_metrics_gc" {
  count         = var.enable_bigtable_serving ? 1 : 0
  instance_name = google_bigtable_instance.realtime_serving[0].name
  table         = google_bigtable_table.user_activity_serving[0].name
  column_family = "cf_metrics"

  max_version {
    number = 1
  }
}

# ------------------------------------------------------------------------------
# LAB 3: Cloud Composer Environment (Week 6 Airflow Lab) — Default: count = 0 ($0)
# ------------------------------------------------------------------------------
resource "google_composer_environment" "orchestration_airflow" {
  count  = var.enable_composer ? 1 : 0
  name   = "${var.name_prefix}-composer-env"
  region = var.region
  labels = merge(var.common_labels, { cost_tier = "ephemeral_hourly" })

  config {
    environment_size = "ENVIRONMENT_SIZE_SMALL"

    node_config {
      service_account = var.sa_orchestrate_email
    }
  }
}
