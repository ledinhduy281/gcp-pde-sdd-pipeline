resource "google_storage_bucket" "raw" {
  name                        = "${var.project_id}-${var.name_prefix}-raw"
  location                    = var.region
  storage_class               = "STANDARD"
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"
  force_destroy               = true
  labels                      = merge(var.common_labels, { cost_tier = "serverless", zone = "raw" })

  lifecycle_rule {
    condition { age = 30 }
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }

  lifecycle_rule {
    condition { age = 90 }
    action {
      type          = "SetStorageClass"
      storage_class = "COLDLINE"
    }
  }
}

resource "google_storage_bucket" "curated" {
  name                        = "${var.project_id}-${var.name_prefix}-curated"
  location                    = var.region
  storage_class               = "STANDARD"
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"
  force_destroy               = true
  labels                      = merge(var.common_labels, { cost_tier = "serverless", zone = "curated" })
}

resource "google_storage_bucket" "temp" {
  name                        = "${var.project_id}-${var.name_prefix}-temp"
  location                    = var.region
  storage_class               = "STANDARD"
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"
  force_destroy               = true
  labels                      = merge(var.common_labels, { cost_tier = "serverless", zone = "temp" })

  lifecycle_rule {
    condition { age = 7 }
    action { type = "Delete" }
  }
}

# Bucket-level Least Privilege IAM
resource "google_storage_bucket_iam_member" "ingest_raw_creator" {
  bucket = google_storage_bucket.raw.name
  role   = "roles/storage.objectCreator"
  member = "serviceAccount:${var.sa_ingest_email}"
}

resource "google_storage_bucket_iam_member" "process_raw_viewer" {
  bucket = google_storage_bucket.raw.name
  role   = "roles/storage.objectViewer"
  member = "serviceAccount:${var.sa_process_email}"
}

resource "google_storage_bucket_iam_member" "process_curated_admin" {
  bucket = google_storage_bucket.curated.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${var.sa_process_email}"
}

resource "google_storage_bucket_iam_member" "process_temp_admin" {
  bucket = google_storage_bucket.temp.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${var.sa_process_email}"
}

# BigLake Cloud Resource Connection (PDE Lakehouse Exam Topic)
resource "google_bigquery_connection" "biglake" {
  connection_id = "${var.name_prefix}-biglake-conn"
  location      = var.region
  friendly_name = "PDE BigLake Storage Connection"
  description   = "Enables fine-grained BigQuery governance over Parquet files in GCS"
  cloud_resource {}
}

resource "google_storage_bucket_iam_member" "biglake_curated_viewer" {
  bucket = google_storage_bucket.curated.name
  role   = "roles/storage.objectViewer"
  member = "serviceAccount:${google_bigquery_connection.biglake.cloud_resource[0].service_account_id}"
}
