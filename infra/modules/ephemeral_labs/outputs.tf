output "bigtable_instance_name" {
  value = var.enable_bigtable_serving ? google_bigtable_instance.realtime_serving[0].name : "DISABLED (cost=$0)"
}

output "cloudsql_instance_name" {
  value = var.enable_cloudsql_cdc ? google_sql_database_instance.oltp_postgres[0].name : "DISABLED (cost=$0)"
}
