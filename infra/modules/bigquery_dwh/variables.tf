variable "project_id" { type = string }
variable "region" { type = string }
variable "name_prefix" { type = string }
variable "curated_bucket_name" { type = string }
variable "biglake_connection_id" { type = string }
variable "sa_process_email" { type = string }
variable "sa_orchestrate_email" { type = string }
variable "common_labels" { type = map(string) }
