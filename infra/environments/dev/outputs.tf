output "raw_bucket_name" {
  description = "GCS Raw landing bucket"
  value       = module.storage_lakehouse.raw_bucket_name
}

output "curated_bucket_name" {
  description = "GCS Curated Parquet lakehouse bucket"
  value       = module.storage_lakehouse.curated_bucket_name
}

output "temp_bucket_name" {
  description = "GCS Temp scratch bucket"
  value       = module.storage_lakehouse.temp_bucket_name
}

output "pubsub_events_topic" {
  description = "Main Pub/Sub topic for streaming telemetry and orders"
  value       = module.pubsub_messaging.events_topic_name
}

output "pubsub_dlq_topic" {
  description = "Dead-letter Pub/Sub topic for unprocessable messages"
  value       = module.pubsub_messaging.dlq_topic_name
}

output "bigquery_datasets" {
  description = "Provisioned BigQuery datasets"
  value = {
    raw     = module.bigquery_dwh.raw_dataset_id
    staging = module.bigquery_dwh.staging_dataset_id
    marts   = module.bigquery_dwh.marts_dataset_id
    ml      = module.bigquery_dwh.ml_dataset_id
  }
}

output "github_wif_provider" {
  description = "Workload Identity Provider resource name for GitHub Actions"
  value       = module.iam_security.wif_provider_name
}

output "active_hourly_labs" {
  description = "Status of hourly-billed lab feature flags (All should be false when idle)"
  value = {
    cloudsql_cdc        = var.enable_cloudsql_cdc
    bigtable_serving    = var.enable_bigtable_serving
    dataproc_serverless = var.enable_dataproc_serverless
    streaming_dataflow  = var.enable_streaming_dataflow
    composer            = var.enable_composer
  }
}
