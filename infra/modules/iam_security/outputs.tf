output "sa_ingest_email" { value = google_service_account.sa_ingest.email }
output "sa_process_email" { value = google_service_account.sa_process.email }
output "sa_orchestrate_email" { value = google_service_account.sa_orchestrate.email }
output "kms_crypto_key_id" { value = google_kms_crypto_key.lakehouse_cmek.id }
output "wif_provider_name" { value = google_iam_workload_identity_pool_provider.github_provider.name }
