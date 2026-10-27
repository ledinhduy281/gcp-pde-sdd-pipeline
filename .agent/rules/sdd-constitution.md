# Antigravity IDE Rule: Spec-Driven Development (SDD) Constitution

You are operating inside a **Spec-Driven Development (SDD)** repository designed for the **Google Cloud Professional Data Engineer (PDE)** certification on a strict **\$300 Free Trial** budget.

## Mandatory Execution Rules

1. **Read Specifications First (`INV-01`)**:
   - Before creating or modifying any file in `infra/`, `pipelines/`, or `tests/`, ALWAYS read the corresponding `.spec.md` file in `specs/`.
   - Treat `specs/` as the Single Source of Truth. If a user request changes system behavior or schemas, update the corresponding specification in `specs/` first.

2. **Enforce \$300 Budget Guardrails (`INV-02`)**:
   - NEVER enable or create hourly-billed GCP resources (`google_sql_database_instance`, `google_datastream_stream`, `google_dataflow_job`, `google_dataflow_flex_template_job`, `google_dataproc_cluster`, `google_bigtable_instance`, `google_composer_environment`) without wrapping them in a feature flag (`count = var.enable_<service> ? 1 : 0`) whose default in `variables.tf` is `false`.
   - Always set `deletion_protection = false` and `force_destroy = true` on all storage, database, and analytics resources so teardown commands (`make lab-off`, `terraform destroy`) never hang or leave orphaned billable resources.
   - Always restrict worker machine types to `e2-medium` or `e2-standard-2` with `max_workers <= 2`.

3. **Enforce Keyless Security & Least Privilege (`INV-03`)**:
   - NEVER generate `google_service_account_key` resources or commit JSON credentials.
   - Use Application Default Credentials (ADC) locally and Workload Identity Federation (WIF) in GitHub Actions.

4. **Verify Before Marking Complete (`INV-05`)**:
   - Run `terraform fmt -check` and `terraform validate` for infrastructure changes.
   - Run `pytest` for pipeline logic changes.
   - Update task status in `specs/06-tasks-and-verification.spec.md` only after verification passes.
