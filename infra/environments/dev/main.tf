locals {
  name_prefix = "${var.project_prefix}-${var.environment}"
  common_labels = {
    managed_by = "terraform"
    env        = var.environment
    project    = "gcp-pde-sdd"
  }
}

module "iam_security" {
  source            = "../../modules/iam_security"
  project_id        = var.project_id
  region            = var.region
  name_prefix       = local.name_prefix
  github_repository = var.github_repository
  common_labels     = local.common_labels
}

module "storage_lakehouse" {
  source            = "../../modules/storage_lakehouse"
  project_id        = var.project_id
  region            = var.region
  name_prefix       = local.name_prefix
  sa_ingest_email   = module.iam_security.sa_ingest_email
  sa_process_email  = module.iam_security.sa_process_email
  kms_crypto_key_id = module.iam_security.kms_crypto_key_id
  common_labels     = local.common_labels
}

module "pubsub_messaging" {
  source           = "../../modules/pubsub_messaging"
  project_id       = var.project_id
  name_prefix      = local.name_prefix
  sa_ingest_email  = module.iam_security.sa_ingest_email
  sa_process_email = module.iam_security.sa_process_email
  common_labels    = local.common_labels
}

module "bigquery_dwh" {
  source                = "../../modules/bigquery_dwh"
  project_id            = var.project_id
  region                = var.region
  name_prefix           = local.name_prefix
  curated_bucket_name   = module.storage_lakehouse.curated_bucket_name
  biglake_connection_id = module.storage_lakehouse.biglake_connection_id
  sa_process_email      = module.iam_security.sa_process_email
  sa_orchestrate_email  = module.iam_security.sa_orchestrate_email
  common_labels         = local.common_labels
}

module "orchestration" {
  source               = "../../modules/orchestration"
  project_id           = var.project_id
  region               = var.region
  name_prefix          = local.name_prefix
  sa_orchestrate_email = module.iam_security.sa_orchestrate_email
  raw_dataset_id       = module.bigquery_dwh.raw_dataset_id
  marts_dataset_id     = module.bigquery_dwh.marts_dataset_id
  common_labels        = local.common_labels
}

module "ephemeral_labs" {
  source                     = "../../modules/ephemeral_labs"
  project_id                 = var.project_id
  region                     = var.region
  name_prefix                = local.name_prefix
  sa_process_email           = module.iam_security.sa_process_email
  sa_orchestrate_email       = module.iam_security.sa_orchestrate_email
  raw_bucket_name            = module.storage_lakehouse.raw_bucket_name
  curated_bucket_name        = module.storage_lakehouse.curated_bucket_name
  temp_bucket_name           = module.storage_lakehouse.temp_bucket_name
  enable_cloudsql_cdc        = var.enable_cloudsql_cdc
  enable_bigtable_serving    = var.enable_bigtable_serving
  enable_dataproc_serverless = var.enable_dataproc_serverless
  enable_streaming_dataflow  = var.enable_streaming_dataflow
  enable_composer            = var.enable_composer
  common_labels              = local.common_labels
}
