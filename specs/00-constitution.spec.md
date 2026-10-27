# SPEC 00: Project Constitution & Non-Negotiable Invariants

## 1. Purpose
This Constitution defines the immutable architectural, operational, security, and financial rules governing the **GCP Professional Data Engineer (PDE) Spec-Driven Pipeline**. Every developer and AI coding agent (such as **Flash 3.8** on **Antigravity IDE**) must validate proposed changes against these invariants before writing or modifying code.

---

## 2. Core Invariants

### INV-01: Spec-First Development
- No Terraform module (`infra/`), pipeline script (`pipelines/`), or test (`tests/`) may be created or altered unless its contract is explicitly defined in `specs/01` through `specs/06`.
- When requirements evolve, update the specification file first, then synchronize the implementation.

### INV-02: Strict \$300 Free Trial Cost Guardrails
- **Two-Tier Cost Separation**:
  - **Tier 1 (Core Serverless — Always On)**: Cloud Storage, BigQuery Datasets/Tables, BigLake Connections, Pub/Sub Topics/Subscriptions, Data Catalog Taxonomies/Policy Tags, Cloud KMS, Cloud Workflows, Cloud Scheduler, and IAM/WIF.
  - **Tier 2 (Ephemeral Hourly — Off by Default)**: Cloud SQL, Datastream, Dataflow Streaming Jobs, Dataproc Serverless/Clusters, Cloud Bigtable, and Cloud Composer.
- **Feature Flag Enforcement**:
  - Every Tier 2 resource MUST be guarded by `count = var.enable_<feature> ? 1 : 0` where `default = false` in `variables.tf`.
- **Clean Teardown**:
  - Every stateful resource MUST set `deletion_protection = false` and `force_destroy = true` (or `delete_contents_on_destroy = true`) so `make lab-off` and `terraform destroy` execute with zero manual blockers.
- **Compute Sizing Limits**:
  - Dataflow/Dataproc workers MUST use `e2-medium` or `e2-standard-2` with `max_workers <= 2`.
  - Bigtable instances MUST use `num_nodes = 1`.
  - Cloud SQL instances MUST use `tier = "db-f1-micro"` and `availability_type = "ZONAL"`.

### INV-03: Zero Static Credentials & Least Privilege IAM
- Creating `google_service_account_key` resources or committing `.json` key files is strictly prohibited.
- Local execution authenticates via **Application Default Credentials (ADC)**.
- GitHub Actions CI/CD authenticates via **Workload Identity Federation (WIF)** scoped to `ledinhduy281/gcp-pde-sdd-pipeline`.
- Dedicated Service Accounts MUST separate responsibilities:
  - `sa-ingest`: Publishes to Pub/Sub and writes raw files to the Raw GCS bucket.
  - `sa-process`: Runs Dataflow/Dataproc jobs, reads Raw GCS/PubSub, writes to Curated GCS, BigQuery Staging, and Bigtable.
  - `sa-orchestrate`: Runs Cloud Workflows and triggers downstream jobs via Service Account permissions.

### INV-04: Standard Naming & Resource Attribution Labels
- Resource names MUST follow `${var.project_prefix}-${var.environment}-<component>`.
- All label-capable resources MUST include:
  ```hcl
  labels = {
    managed_by = "terraform"
    env        = var.environment
    cost_tier  = "serverless" # or "ephemeral_hourly"
    project    = "gcp-pde-sdd"
  }
  ```

### INV-05: Deterministic Verification Gates
- Every change to `infra/` MUST pass `terraform fmt -check -recursive` and `terraform validate`.
- Every change to `pipelines/` MUST pass `pytest tests/`.
