# Antigravity IDE Rule: Spec-Driven Development (SDD) Constitution for Excelerate-Jinder on GCP

You are operating inside a **Spec-Driven Development (SDD)** repository unifying the **Excelerate-Jinder Autonomous Capability Alignment Platform** (`jinder_platform/`, `jinder_backend_engine/`, `jinder_frontend/`) with its **Google Cloud Professional Data Engineer (PDE) Lakehouse & Streaming Pipeline** (`infra/`, `pipelines/`, `showcase/`) on a strict **$300 Free Trial** budget.

## Mandatory Execution Rules

1. **Read Specifications First (`INV-01`)**:
   - Before creating or modifying any file in `infra/`, `pipelines/`, `jinder_platform/`, or `tests/`, ALWAYS read the corresponding `.spec.md` file in `specs/`.
   - Treat `specs/` as the Single Source of Truth. If a user request changes system behavior or schemas, update the corresponding specification in `specs/` first.

2. **Enforce $300 Budget Guardrails (`INV-02`)**:
   - NEVER enable or create hourly-billed GCP resources (`google_sql_database_instance`, `google_datastream_stream`, `google_dataflow_job`, `google_dataflow_flex_template_job`, `google_dataproc_cluster`, `google_bigtable_instance`, `google_composer_environment`) without wrapping them in a feature flag (`count = var.enable_<service> ? 1 : 0`) whose default in `variables.tf` is `false`.
   - Always set `deletion_protection = false` and `force_destroy = true` on all storage, database, and analytics resources so teardown commands (`make lab-off`, `terraform destroy`) never hang or leave orphaned billable resources.

3. **Enforce Keyless Security & Public Repo Safety (`INV-03`)**:
   - NEVER generate `google_service_account_key` resources or commit JSON credentials, `.tfvars`, or `.tfstate` files.
   - Use Application Default Credentials (ADC) locally and Workload Identity Federation (WIF) scoped to `ledinhduy281/gcp-pde-sdd-pipeline` in GitHub Actions so the public repository never exposes GCP resources to external users.

4. **Enforce Jinder Zero-PII Governance (`INV-06` / `REQ-A07`)**:
   - Direct candidate identifiers (`customer_email`, `legal_name`, `phone`, `cv_raw_text`) MUST be protected by BigQuery Data Catalog Policy Tags (`PII_HIGH_SENSITIVITY`), exposing only anonymized `alias` and capability metrics (`frs_score`, `smf_score`, `gsi_score`, `tss_score`) to Employer/HR views.

5. **Verify Before Marking Complete (`INV-05`)**:
   - Run `terraform -chdir=infra fmt -check -recursive` and `terraform -chdir=infra/environments/dev validate` for infrastructure changes.
   - Run `make test` and `make test-jinder-local` for pipeline and application logic changes.
