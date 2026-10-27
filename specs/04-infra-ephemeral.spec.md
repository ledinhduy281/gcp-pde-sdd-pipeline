# SPEC 04: Ephemeral Hourly Infrastructure Specification (`cost_tier = "ephemeral_hourly"`)

## 1. Objective
Specify all hourly-billed GCP services required for hands-on **Professional Data Engineer (PDE)** exam preparation in `infra/modules/ephemeral_labs`. Every resource in this module MUST be disabled by default (`false`) and toggled on only during active study sessions.

---

## 2. Feature Flag Specifications

### 2.1. `enable_cloudsql_cdc` (Default: `false`)
- **Resources**:
  - `google_sql_database_instance`: PostgreSQL 15 instance with `tier = "db-f1-micro"`, `availability_type = "ZONAL"`, `deletion_protection = false`, `disk_size = 10`.
  - `google_sql_database`: `ecommerce_oltp`.
- **PDE Exam Concepts Covered**: Change Data Capture (CDC) source configuration, `pglogical` replication flags, Zonal vs Regional HA trade-offs.

### 2.2. `enable_bigtable_serving` (Default: `false`)
- **Resources**:
  - `google_bigtable_instance`: 1-node SSD cluster (`num_nodes = 1`, `deletion_protection = false`).
  - `google_bigtable_table`: `user_activity_serving` with column family `cf_metrics`.
  - `google_bigtable_gc_policy`: `max_version = 1` to prevent unbounded storage growth.
- **PDE Exam Concepts Covered**: Low-latency time-series serving, Row Key design against hotspotting, Garbage Collection policies.

### 2.3. `enable_dataproc_serverless` (Default: `false`)
- **Resources**:
  - `google_dataproc_batch`: Executes `orders_raw_to_curated.py` from the temp GCS bucket using Dataproc Serverless (`runtime_config.version = "2.2"`), writing curated Parquet files to the `curated` bucket.
- **PDE Exam Concepts Covered**: Separating Compute and Storage (GCS vs HDFS), Ephemeral Spark batch execution, Cloud Storage Connector.

### 2.4. `enable_composer` (Default: `false`)
- **Resources**:
  - `google_composer_environment`: Cloud Composer 2 environment (`ENVIRONMENT_SIZE_SMALL`) using `sa-orchestrate`.
- **PDE Exam Concepts Covered**: Managed Apache Airflow DAGs, Kubernetes Executor scaling, Cross-service orchestration vs Cloud Workflows.

---

## 3. Mandatory Teardown Protocol (`make lab-off`)
Running `make lab-off` executes `scripts/cost_killswitch.sh`, which forces all `enable_*` variables to `false` via `terraform apply -auto-approve` and verifies that zero Cloud SQL, Bigtable, Dataproc, Dataflow, or Composer instances remain active.
