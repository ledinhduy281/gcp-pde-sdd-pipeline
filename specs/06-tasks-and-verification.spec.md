# SPEC 06: Phased Execution Roadmap & Deterministic Verification

Track your progress toward the **Google Cloud Professional Data Engineer (PDE)** certification by executing these phases in order. Mark a task `[x]` only when its verification command succeeds.

---

## Phase 1: Connection, Bootstrap & Core Serverless IaC (Week 1)
- [x] **T-1.1**: Authenticate `gcloud` and Application Default Credentials (ADC).
  - *Verify*: `gcloud auth application-default print-access-token >/dev/null && echo "ADC OK"`
- [x] **T-1.2**: Run `make bootstrap` to enable GCP APIs and create the versioned GCS Terraform State bucket.
  - *Verify*: `gcloud storage buckets describe gs://${GCP_PROJECT_ID}-tfstate --format="value(versioning_enabled)"`
- [x] **T-1.3**: Create the GitHub repository `ledinhduy281/gcp-pde-sdd-pipeline` and push the SDD codebase.
  - *Verify*: `gh repo view ledinhduy281/gcp-pde-sdd-pipeline`
- [ ] **T-1.4**: Validate and deploy the Core Serverless Terraform infrastructure (`$0.00/hr`).
  - *Verify*: `make validate-infra && make apply-core`

## Phase 2: Data Contracts & Local Apache Beam Verification (Week 2)
- [ ] **T-2.1**: Run automated unit tests for event simulation, Dead-Letter Queue (DLQ) routing, windowing, and Bigtable anti-hotspot row keys using `DirectRunner` ($0 cost).
  - *Verify*: `make test`

## Phase 3: Batch Lakehouse — GCS, PySpark, BigLake & Dataform (Week 3)
- [ ] **T-3.1**: Generate synthetic batch data to the Raw GCS bucket and run the PySpark curation job on Dataproc Serverless.
  - *Verify*: `gcloud storage ls gs://${GCP_PROJECT_ID}-pde-dev-curated/orders/`
- [ ] **T-3.2**: Execute Dataform SQLX transformations and assertions in BigQuery.
  - *Verify*: `bq query --use_legacy_sql=false "SELECT COUNT(*) FROM marts.fact_daily_revenue"`

## Phase 4: Real-Time Streaming & Bigtable NoSQL Lab (Week 4)
- [ ] **T-4.1**: Enable the Bigtable lab (`make lab-bigtable-on`), stream events through Apache Beam into BigQuery (`raw.events_stream` + `raw.malformed_events`) and Bigtable (`user_activity_serving`).
  - *Verify*: `cbt -project=${GCP_PROJECT_ID} -instance=pde-dev-bt-instance count user_activity_serving`
- [ ] **T-4.2**: Immediately tear down hourly resources after completing the lab.
  - *Verify*: `make lab-off`

## Phase 5: Data Governance, Security & BigQuery ML (Week 5)
- [ ] **T-5.1**: Verify Column-Level Security Policy Tag enforcement on `marts.dim_customers.customer_email`.
- [ ] **T-5.2**: Train and evaluate the BigQuery ML Customer Churn & Revenue Forecasting models.
  - *Verify*: `bq query --use_legacy_sql=false < pipelines/bqml/churn_logistic_reg.sql`

## Phase 6: Orchestration — Cloud Workflows vs Cloud Composer (Week 6)
- [ ] **T-6.1**: Trigger the serverless Cloud Workflow (`pde-dev-daily-lakehouse-wf`) and inspect execution steps.
  - *Verify*: `gcloud workflows run pde-dev-daily-lakehouse-wf --location=${GCP_REGION}`
- [ ] **T-6.2**: (Optional Capstone Lab) Enable Cloud Composer (`make lab-composer-on`), test `pde_lakehouse_dag.py`, and run `make lab-off` within 2 hours.
