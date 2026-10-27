# SPEC 03: Core Serverless Infrastructure Specification (`cost_tier = "serverless"`)

## 1. Objective
Specify all Terraform modules that remain **Always-On** at **$0.00/month** (within GCP Free Tier allowances) to support the **Excelerate-Jinder** data lakehouse, streaming ingestion, Zero-PII governance, and daily orchestration without burning your $300 trial credit.

---

## 2. Module Specifications

### 2.1. `infra/modules/iam_security`
- **Service Accounts (Least Privilege)**:
  - `${prefix}-sa-ingest`: Granted `roles/pubsub.publisher` and `roles/storage.objectCreator` on the Raw bucket.
  - `${prefix}-sa-process`: Granted `roles/pubsub.subscriber`, `roles/storage.objectAdmin` (Curated/Temp), `roles/bigquery.dataEditor`, `roles/bigquery.jobUser`, `roles/dataflow.worker`, and `roles/dataproc.worker`.
  - `${prefix}-sa-orchestrate`: Granted `roles/workflows.invoker` and `roles/bigquery.jobUser`.
- **Cloud KMS (CMEK)**:
  - `google_kms_key_ring` and `google_kms_crypto_key` with `rotation_period = "7776000s"` (90 days).
- **Workload Identity Federation (WIF)**:
  - `google_iam_workload_identity_pool` and `google_iam_workload_identity_pool_provider` restricted via `assertion.repository == 'ledinhduy281/gcp-pde-sdd-pipeline'`.

### 2.2. `infra/modules/storage_lakehouse`
- **GCS Buckets**:
  - `${prefix}-raw`: Landing zone for Jinder CSV/JSON datasets (`australian_jobs_dataset.csv`, `international_candidates_dataset.csv`, `real_resumes_dataset.csv`, `talents.json`, `jobs.json`, `ict_taxonomy.json`). Lifecycle transitions objects to `NEARLINE` after 30 days and `COLDLINE` after 90 days.
  - `${prefix}-curated`: Stores Hive-partitioned Parquet tables for BigLake.
  - `${prefix}-temp`: Scratch bucket for Dataflow/Dataproc; lifecycle rule deletes objects after 7 days.
- **BigLake Connection**:
  - `google_bigquery_connection.biglake` granted `roles/storage.objectViewer` on the `curated` bucket.

### 2.3. `infra/modules/pubsub_messaging`
- **Topics**: `${prefix}-events-topic` and `${prefix}-events-dlq-topic`.
- **Subscription**: `${prefix}-events-beam-sub` with `ack_deadline_seconds = 60` and `dead_letter_policy` (`max_delivery_attempts = 5` forwarding to `${prefix}-events-dlq-topic`).

### 2.4. `infra/modules/bigquery_dwh`
- **Datasets**: `raw`, `staging`, `marts`, `ml` (`delete_contents_on_destroy = true`).
- **Zero-PII Data Catalog Policy Tags (`REQ-A07`)**:
  - `google_data_catalog_taxonomy.pii_taxonomy` (`${prefix}-jinder-zero-pii`)
  - `google_data_catalog_policy_tag.pii_high` (`PII_HIGH_SENSITIVITY`)
- **Tables**:
  - `raw.events_stream`, `raw.malformed_events`, `marts.dim_customers` (with Policy Tag on `customer_email`), `marts.dim_jobs`, and `marts.fact_daily_revenue`.

### 2.5. `infra/modules/orchestration`
- **`google_workflows_workflow.daily_lakehouse_wf`**: Serverless state machine executing a `MERGE` query from `raw.events_stream` into `marts.fact_daily_revenue`.
- **`google_cloud_scheduler_job.daily_trigger`**: Cron trigger (`0 2 * * *`, `paused = true` by default).
