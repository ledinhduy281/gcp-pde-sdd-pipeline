# GCP Professional Data Engineer (PDE) Pipeline — Spec-Driven Development (SDD)

An end-to-end, production-grade **Google Cloud Data Engineering Lakehouse & Streaming Pipeline** built with **Terraform (IaC)** and structured around **Spec-Driven Development (SDD)** for the **Google Cloud Professional Data Engineer (PDE)** certification.

Designed specifically to run within the **\$300 GCP Free Trial** using a **Two-Tier Cost Architecture**:
1. **Core Serverless Tier (Always-On, ~\$0.00/month)**: Cloud Storage (GCS), BigLake, BigQuery (Partitioned & Clustered), Dataform (SQLX), Pub/Sub (with Dead-Letter Queue), Cloud KMS (CMEK), Data Catalog Policy Tags (Column-Level Security), Cloud Workflows, and Workload Identity Federation (WIF).
2. **Ephemeral Hourly Lab Tier (Controlled via Terraform Feature Flags, Default `false`)**: Cloud SQL + Datastream (CDC), Dataflow (Apache Beam Streaming), Dataproc Serverless (PySpark), Cloud Bigtable (Anti-Hotspot Row Keys), and Cloud Composer (Airflow).

---

## Repository Structure

```text
.
├── .agent/rules/sdd-constitution.md       # Antigravity IDE Spec-First enforcement rules
├── .github/workflows/                     # Keyless CI/CD via Workload Identity Federation
├── specs/                                 # SDD Single Source of Truth
│   ├── 00-constitution.spec.md            # Architectural, security, and $300 cost invariants
│   ├── 01-connection-bootstrap.spec.md    # Step-by-step GCP + ADC + GitHub connection guide
│   ├── 02-data-contracts.spec.md          # JSON, Parquet, BigQuery, and Bigtable schemas
│   ├── 03-infra-core.spec.md              # Always-on Serverless Terraform specifications
│   ├── 04-infra-ephemeral.spec.md         # Feature-flagged hourly resource specifications
│   ├── 05-pipelines.spec.md               # Beam, PySpark, Dataform, and BQML specifications
│   └── 06-tasks-and-verification.spec.md  # Execution roadmap and verification commands
├── infra/                                 # Modular Terraform Infrastructure-as-Code
│   ├── environments/dev/                  # Root Terraform configuration & Feature Flag switchboard
│   └── modules/                           # Reusable GCP Terraform modules
├── pipelines/                             # Data Engineering application code
│   ├── simulator/                         # Synthetic e-commerce & telemetry event generator
│   ├── streaming_beam/                    # Apache Beam streaming pipeline (Windowing, Watermarks, DLQ)
│   ├── spark_jobs/                        # Dataproc Serverless PySpark raw-to-curated Parquet job
│   ├── dataform/                          # SQLX transformations & data quality assertions
│   ├── bqml/                              # BigQuery ML churn & time-series forecasting models
│   └── orchestration/                     # Cloud Workflows YAML & Cloud Composer Airflow DAG
├── scripts/                               # Bootstrap & emergency cost kill-switch scripts
├── tests/                                 # Automated unit & data contract verification tests
└── Makefile                               # One-command workflow automation
```

---

## Quick Start: Step-by-Step Connection & Setup

See [specs/01-connection-bootstrap.spec.md](specs/01-connection-bootstrap.spec.md) for the complete specification.

### 1. Authenticate GCP & Application Default Credentials (ADC)
```bash
gcloud auth login
export GCP_PROJECT_ID="your-gcp-project-id"
gcloud config set project "${GCP_PROJECT_ID}"

# Authenticate Terraform ADC
gcloud auth application-default login
gcloud auth application-default set-quota-project "${GCP_PROJECT_ID}"
```

### 2. Bootstrap GCP APIs & Terraform State Bucket
```bash
export GCP_PROJECT_ID="your-gcp-project-id"
export GCP_REGION="us-central1"
make bootstrap
```

### 3. Deploy Core Serverless Infrastructure (\$0/hr)
```bash
make init
make validate-infra
make apply-core
```

### 4. Toggle Hourly PDE Labs Safely (And Turn Them Off When Done!)
```bash
# Turn ON a specific lab (e.g., Bigtable or Cloud SQL CDC)
make lab-bigtable-on
make lab-cdc-on

# IMMEDIATELY turn OFF all hourly resources after finishing your study session:
make lab-off
```
