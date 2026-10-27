# SPEC 06: Phased Execution Roadmap & Deterministic Verification

Track your progress toward both showcasing **Excelerate-Jinder on GCP** and passing the **Google Cloud Professional Data Engineer (PDE)** exam. Mark a task `[x]` only when its verification command succeeds.

---

## Phase 0: Local Excelerate-Jinder Application & Data Contract Verification ($0 Cost)
- [x] **T-0.1**: Verify Jinder Web App (`jinder_platform`, `jinder_backend_engine`, `jinder_frontend`) and GCP Data Contracts locally.
  - *Verify*: `make test && python3 pipelines/simulator/generate_events.py --mode stdout --count 5`
- [ ] **T-0.2**: Launch the Jinder Web App locally on `http://localhost:8095/`.
  - *Verify*: `make run-jinder-local`

## Phase 1: GCP Connection, Bootstrap & Core Serverless IaC (Week 1 — $0/hr)
- [ ] **T-1.1**: Authenticate `gcloud` and Application Default Credentials (ADC).
  - *Verify*: `gcloud auth application-default print-access-token >/dev/null && echo "ADC OK"`
- [ ] **T-1.2**: Run `make bootstrap` to enable GCP APIs and create the versioned GCS Terraform State bucket.
  - *Verify*: `gcloud storage buckets describe gs://${GCP_PROJECT_ID}-tfstate --format="value(versioning.enabled)"`
- [ ] **T-1.3**: Push the unified Jinder + GCP SDD repository to `https://github.com/ledinhduy281/gcp-pde-sdd-pipeline`.
  - *Verify*: `gh repo view ledinhduy281/gcp-pde-sdd-pipeline`
- [ ] **T-1.4**: Validate and deploy the Core Serverless Terraform infrastructure (`$0.00/hr`).
  - *Verify*: `make validate-infra && make apply-core`

## Phase 2: Batch Lakehouse — Jinder Corpus on GCS, PySpark, BigLake & Dataform (Week 2–3)
- [ ] **T-2.1**: Upload Jinder datasets (`australian_jobs_dataset.csv`, `international_candidates_dataset.csv`, `talents.json`, `jobs.json`) to the Raw GCS bucket:
  - *Verify*: `gcloud storage cp jinder_backend_engine/data/synthetic/*.json gs://${GCP_PROJECT_ID}-pde-dev-raw/jinder/`
- [ ] **T-2.2**: Execute Dataform SQLX transformations and assertions in BigQuery.
  - *Verify*: `bq query --use_legacy_sql=false "SELECT COUNT(*) FROM marts.fact_daily_revenue"`

## Phase 3: Real-Time Jinder Streaming (`FRS*`) & Bigtable NoSQL Lab (Week 4)
- [ ] **T-3.1**: Publish 100 real Jinder events to Pub/Sub:
  - *Verify*: `python3 pipelines/simulator/generate_events.py --mode pubsub --project-id=${GCP_PROJECT_ID} --count 100`
- [ ] **T-3.2**: Enable the Bigtable lab (`make lab-bigtable-on`), inspect `user_activity_serving` on GCP UI, then immediately tear down hourly resources (`make lab-off`).
  - *Verify*: `make lab-off`

## Phase 4: Zero-PII Governance (`REQ-A07`) & BigQuery ML Shortlist Prediction (Week 5)
- [ ] **T-4.1**: Verify Column-Level Security Policy Tag (`PII_HIGH_SENSITIVITY`) on `marts.dim_customers.customer_email`.
- [ ] **T-4.2**: Train and evaluate `ml.jinder_shortlist_logreg` using Jinder's F-01..F-06 mathematical scores.
  - *Verify*: `bq query --use_legacy_sql=false < pipelines/bqml/churn_logistic_reg.sql`

## Phase 5: Serverless Orchestration — Cloud Workflows vs Cloud Composer (Week 6)
- [ ] **T-5.1**: Trigger `pde-dev-daily-lakehouse-wf` in Cloud Workflows ($0 cost).
  - *Verify*: `gcloud workflows run pde-dev-daily-lakehouse-wf --location=${GCP_REGION}`
