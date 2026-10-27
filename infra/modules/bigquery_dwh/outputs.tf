output "raw_dataset_id" { value = google_bigquery_dataset.raw.dataset_id }
output "staging_dataset_id" { value = google_bigquery_dataset.staging.dataset_id }
output "marts_dataset_id" { value = google_bigquery_dataset.marts.dataset_id }
output "ml_dataset_id" { value = google_bigquery_dataset.ml.dataset_id }
output "pii_policy_tag_id" { value = google_data_catalog_policy_tag.pii_high.id }
