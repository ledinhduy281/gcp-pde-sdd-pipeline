resource "google_service_account" "sa_ingest" {
  account_id   = "${var.name_prefix}-sa-ingest"
  display_name = "PDE Ingestion Service Account (Least Privilege)"
}

resource "google_service_account" "sa_process" {
  account_id   = "${var.name_prefix}-sa-process"
  display_name = "PDE Processing Service Account (Dataflow & Dataproc)"
}

resource "google_service_account" "sa_orchestrate" {
  account_id   = "${var.name_prefix}-sa-orchestrate"
  display_name = "PDE Orchestration Service Account (Workflows & Composer)"
}

# Project-level minimal roles required for processing & orchestration jobs
resource "google_project_iam_member" "process_bq_job_user" {
  project = var.project_id
  role    = "roles/bigquery.jobUser"
  member  = "serviceAccount:${google_service_account.sa_process.email}"
}

resource "google_project_iam_member" "process_dataflow_worker" {
  project = var.project_id
  role    = "roles/dataflow.worker"
  member  = "serviceAccount:${google_service_account.sa_process.email}"
}

resource "google_project_iam_member" "process_dataproc_worker" {
  project = var.project_id
  role    = "roles/dataproc.worker"
  member  = "serviceAccount:${google_service_account.sa_process.email}"
}

resource "google_project_iam_member" "orchestrate_bq_job_user" {
  project = var.project_id
  role    = "roles/bigquery.jobUser"
  member  = "serviceAccount:${google_service_account.sa_orchestrate.email}"
}

resource "google_project_iam_member" "orchestrate_bq_data_editor" {
  project = var.project_id
  role    = "roles/bigquery.dataEditor"
  member  = "serviceAccount:${google_service_account.sa_orchestrate.email}"
}

resource "google_project_iam_member" "orchestrate_workflows_invoker" {
  project = var.project_id
  role    = "roles/workflows.invoker"
  member  = "serviceAccount:${google_service_account.sa_orchestrate.email}"
}

# Cloud KMS Key Ring & CryptoKey for CMEK Demonstration (PDE Exam Topic)
resource "google_kms_key_ring" "lakehouse_keyring" {
  name     = "${var.name_prefix}-keyring"
  location = var.region
}

resource "google_kms_crypto_key" "lakehouse_cmek" {
  name            = "${var.name_prefix}-cmek-key"
  key_ring        = google_kms_key_ring.lakehouse_keyring.id
  rotation_period = "7776000s" # 90 days automatic rotation
  labels          = merge(var.common_labels, { cost_tier = "serverless" })

  lifecycle {
    prevent_destroy = false
  }
}

# Workload Identity Federation for Keyless GitHub Actions CI/CD
resource "google_iam_workload_identity_pool" "github_pool" {
  workload_identity_pool_id = "${var.name_prefix}-gh-pool"
  display_name              = "GitHub Actions WIF Pool"
  description               = "Keyless authentication pool for GitHub Actions"
}

resource "google_iam_workload_identity_pool_provider" "github_provider" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "${var.name_prefix}-gh-oidc"
  display_name                       = "GitHub OIDC Provider"

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.actor"      = "assertion.actor"
    "attribute.repository" = "assertion.repository"
  }

  attribute_condition = "assertion.repository == '${var.github_repository}'"

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}
