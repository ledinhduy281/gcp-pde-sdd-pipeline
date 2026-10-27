variable "project_id" {
  description = "Google Cloud Project ID linked to the $300 Free Trial"
  type        = string
}

variable "region" {
  description = "Primary GCP region (us-central1 recommended for maximum Free Tier coverage)"
  type        = string
  default     = "us-central1"
}

variable "project_prefix" {
  description = "Short prefix for all GCP resources"
  type        = string
  default     = "pde"
}

variable "environment" {
  description = "Deployment environment name"
  type        = string
  default     = "dev"
}

variable "github_repository" {
  description = "GitHub owner/repo allowed to authenticate via Workload Identity Federation"
  type        = string
  default     = "ledinhduy281/gcp-pde-sdd-pipeline"
}

# ==============================================================================
# EPHEMERAL HOURLY LAB FEATURE FLAGS (INV-02: MUST DEFAULT TO FALSE)
# ==============================================================================
variable "enable_cloudsql_cdc" {
  description = "Provision Cloud SQL PostgreSQL (db-f1-micro) for CDC Lab (~$0.03/hr)"
  type        = bool
  default     = false
}

variable "enable_bigtable_serving" {
  description = "Provision 1-node Cloud Bigtable instance for NoSQL Row-Key Lab (~$0.65/hr)"
  type        = bool
  default     = false
}

variable "enable_dataproc_serverless" {
  description = "Trigger Dataproc Serverless PySpark curation batch (~$0.05/run)"
  type        = bool
  default     = false
}

variable "enable_streaming_dataflow" {
  description = "Enable Dataflow Streaming Lab resources (~$0.07/hr)"
  type        = bool
  default     = false
}

variable "enable_composer" {
  description = "Provision Cloud Composer (Airflow) environment for Week 6 Lab (~$0.45/hr)"
  type        = bool
  default     = false
}
