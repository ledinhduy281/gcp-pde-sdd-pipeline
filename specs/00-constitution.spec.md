# SPEC 00: Project Constitution & Non-Negotiable Invariants

## 1. Purpose
This Constitution defines the immutable architectural, operational, security, privacy, and financial rules governing the **Excelerate-Jinder Application & GCP Professional Data Engineer (PDE) Spec-Driven Pipeline**. Every developer and AI coding agent (such as **Flash 3.8** on **Antigravity IDE**) must validate proposed changes against these invariants before writing or modifying code.

---

## 2. Core Invariants

### INV-01: Spec-First Development
- No Terraform module (`infra/`), pipeline script (`pipelines/`), or test (`tests/`) may be created or altered unless its contract is explicitly defined in `specs/01` through `specs/06`.
- Local application components (`jinder_platform/`, `jinder_backend_engine/`, `jinder_frontend/`) must remain runnable offline with Python 3.9+ standard library (`make run-jinder-local`).

### INV-02: Strict $300 Free Trial Cost Guardrails
- **Two-Tier Cost Separation**:
  - **Tier 1 (Core Serverless — Always On at ~$0.00/month)**: Cloud Storage, BigQuery Datasets/Tables (`raw`, `staging`, `marts`, `ml`), BigLake Connections, Pub/Sub Topics/Subscriptions, Data Catalog Taxonomies/Policy Tags, Cloud KMS, Cloud Workflows, Cloud Scheduler, and IAM/WIF.
  - **Tier 2 (Ephemeral Hourly — Off by Default)**: Cloud SQL, Datastream, Dataflow Streaming Jobs, Dataproc Serverless/Clusters, Cloud Bigtable, and Cloud Composer.
- **Feature Flag Enforcement**:
  - Every Tier 2 resource MUST be guarded by `count = var.enable_<feature> ? 1 : 0` where `default = false` in `variables.tf`.
- **Clean Teardown**:
  - Every stateful resource MUST set `deletion_protection = false` and `force_destroy = true` (or `delete_contents_on_destroy = true`) so `make lab-off` and `terraform destroy` execute with zero manual blockers.

### INV-03: Zero Static Credentials & Public Repository Safety
- Creating `google_service_account_key` resources or committing `.json` key files, `.tfvars`, or `.tfstate` is strictly prohibited.
- External users cloning the public GitHub repository can run the local Jinder app (`make run-jinder-local`) and unit tests (`make test`), but have **zero access** to your GCP project or billing account.
- Local GCP execution authenticates via **Application Default Credentials (ADC)**; GitHub Actions CI/CD authenticates via **Workload Identity Federation (WIF)** restricted to `assertion.repository == 'ledinhduy281/gcp-pde-sdd-pipeline'`.

### INV-04: Standard Naming & Resource Attribution Labels
- Resource names MUST follow `${var.project_prefix}-${var.environment}-<component>`.
- All label-capable resources MUST include `managed_by = "terraform"`, `env = var.environment`, `cost_tier = "serverless" | "ephemeral_hourly"`, and `project = "gcp-pde-sdd"`.

### INV-05: Deterministic Verification Gates
- Every change to `infra/` MUST pass `terraform fmt -check -recursive` and `terraform validate`.
- Every change to `pipelines/` MUST pass `make test`.
- Every change to `jinder_platform/` MUST pass `make test-jinder-local`.

### INV-06: Jinder Zero-PII Anonymization (`REQ-A07`)
- Sensitive candidate PII (`customer_email`, `legal_name`, `phone`, `cv_raw_text`) MUST be governed by BigQuery Column-Level Security (`google_data_catalog_policy_tag.pii_high`), ensuring Employer/HR queries only access anonymized candidate `alias` and capability alignment scores (`F-01` through `F-06`).
