# SPEC 04: Ephemeral Hourly Infrastructure Specification (`cost_tier = "ephemeral_hourly"`)

## 1. Objective
Specify all hourly-billed GCP services required for hands-on **Professional Data Engineer (PDE)** labs in `infra/modules/ephemeral_labs`. Every resource in this module MUST default to `false` (`count = 0`) and be toggled on only during active study or live demo sessions.

---

## 2. Feature Flag Specifications

| Feature Flag (`variables.tf`) | Default | Provisioned Resources | Jinder Use Case & PDE Exam Concept | Hourly Cost |
| :--- | :---: | :--- | :--- | :---: |
| `enable_cloudsql_cdc` | `false` | `google_sql_database_instance` (`db-f1-micro`, Postgres 15, `cloudsql.logical_decoding = on`) | Replicating Jinder's relational OLTP database (`users`, `seeker_profiles`, `jobs`, `applications`) via Serverless Datastream CDC | ~$0.03 / hr |
| `enable_bigtable_serving` | `false` | `google_bigtable_instance` (1 node SSD) + `user_activity_serving` table (`cf_metrics`, `max_version = 1`) | Sub-10ms serving of personalized Jinder Job Feed scores ($FRS^*$) using anti-hotspot salted row keys | ~$0.65 / hr |
| `enable_dataproc_serverless` | `false` | Dataproc Serverless PySpark Batch | Deduplicating raw Jinder Job/Candidate corpora and writing Snappy Parquet to `curated` bucket | ~$0.05 / run |
| `enable_streaming_dataflow` | `false` | Dataflow Streaming Apache Beam Runner | Continuous real-time windowing of Jinder swipe/apply events and DLQ routing | ~$0.07 / hr |
| `enable_composer` | `false` | `google_composer_environment` (`ENVIRONMENT_SIZE_SMALL`) | Week 6 Managed Apache Airflow orchestration lab (`pde_lakehouse_dag.py`) | ~$0.45 / hr |

---

## 3. Mandatory Teardown Protocol (`make lab-off`)
Running `make lab-off` executes `scripts/cost_killswitch.sh`, which forces all five `enable_*` variables to `false` via `terraform apply -auto-approve` and restores your account to **$0.00/hour**.
