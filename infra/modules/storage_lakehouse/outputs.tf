output "raw_bucket_name" { value = google_storage_bucket.raw.name }
output "curated_bucket_name" { value = google_storage_bucket.curated.name }
output "temp_bucket_name" { value = google_storage_bucket.temp.name }
output "biglake_connection_id" { value = google_bigquery_connection.biglake.name }
