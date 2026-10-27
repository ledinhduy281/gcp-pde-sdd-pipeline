# SPEC 03: Core Serverless Infrastructure Specification (`cost_tier = "serverless"`)

## 1. Objective
Specify all Terraform modules that remain **Always-On** at **\$0.00/month** (within GCP Free Tier allowances) so you can continuously develop and test schemas, IAM, KMS, Pub/Sub, BigQuery, BigLake, and Workflows without burning your \$300 trial credit.

---

## 2. Module Specifications

### 2.1. `infra/modules/iam_security`
- **Service Accounts**:
  - `${prefix}-sa-ingest`: Granted `roles/pubsub.publisher` and `roles/storage.objectCreator`.
  - `${prefix}-sa-process`: Granted `roles/pubsub.subscriber`, `roles/storage.objectAdmin`, `roles/bigquery.dataEditor`, `roles/bigquery.jobUser`, and `roles/bigtable.user`.
  - `${prefix}-sa-orchestrate`: Granted `roles/workflows.invoker`, `roles/bigquery.jobUser`, and `roles/dataproc.editor`.
- **Cloud KMS (CMEK)**:
  - `google_kms_key_ring` and `google_kms_crypto_key` with `rotation_period = "7776000s"` (90 days).
- **Workload Identity Federation (WIF)**:
  - `google_iam_workload_identity_pool` and `google_iam_workload_identity_pool_provider` configured for OIDC issuer `https://token.actions.githubusercontent.com` restricted to repository `var.github_repository` (`ledinhduy281/gcp-pde-sdd-pipeline`).

### 2.2. `infra/modules/storage_lakehouse`
- **GCS Buckets**:
  - `${prefix}-raw`: Landing zone for CSV/JSON batches and Datastream CDC files. Lifecycle transitions objects to `NEARLINE` after 30 days and `COLDLINE` after 90 days.
  - `${prefix}-curated`: Stores Hive-partitioned Parquet tables for BigLake.
  - `${prefix}-temp`: Scratch bucket for Dataflow, Dataproc, and BigQuery temp staging; lifecycle rule deletes objects after 7 days.
- **All Buckets Must Enforce**:
  - `uniform_bucket_level_access = true`
  - `public_access_prevention = "enforced"`
  - `force_destroy = true`
- **BigLake Connection**:
  - `google_bigquery_connection` (`cloud_resource`) granted `roles/storage.objectViewer` on the `curated` bucket.

### 2.3. `infra/modules/pubsub_messaging`
- **Topics**:
  - `${prefix}-events-topic` (Main ingestion stream)
  - `${prefix}-events-dlq-topic` (Unprocessable message sink)
- **Subscriptions**:
  - `${prefix}-events-sub`: Attached to `${prefix}-events-topic` with `ack_deadline_seconds = 60` and `dead_letter_policy` (`max_delivery_attempts = 5` forwarding to `${prefix}-events-dlq-topic`).

### 2.4. `infra/modules/bigquery_dwh`
- **Datasets**: `raw`, `staging`, `marts`, `ml` with `delete_contents_on_destroy = true`.
- **Data Catalog Policy Tags**:
  - `google_data_catalog_taxonomy.pii_taxonomy` (`activated_policy_types = ["FINE_GRAINED_ACCESS_CONTROL"]`)
  - `google_data_catalog_policy_tag.pii_high`
- **Tables**:
  - `raw.events_stream` (Partitioned by `DAY(event_timestamp)`, `require_partition_filter = true`, clustered by `event_type, user_id`).
  - `raw.malformed_events` (Partitioned by `DAY(failed_at)`).
  - `marts.dim_customers` (with `customer_email` protected by `pii_high` policy tag).

### 2.5. `infra/modules/orchestration`
- **`google_workflows_workflow`**: Serverless state machine orchestrating BigQuery staging and mart refresh queries.
- **`google_cloud_scheduler_job`**: Cron trigger (`0 2 * * *`, `paused = true` by default) invoking the Cloud Workflow.
