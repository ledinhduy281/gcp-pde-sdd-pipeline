resource "google_workflows_workflow" "daily_lakehouse_wf" {
  name            = "${var.name_prefix}-daily-lakehouse-wf"
  region          = var.region
  description     = "Serverless ELT orchestrator refreshing BigQuery marts from raw streaming events"
  service_account = var.sa_orchestrate_email
  labels          = merge(var.common_labels, { cost_tier = "serverless" })

  source_contents = <<-EOF
  main:
    params: [input]
    steps:
      - refresh_fact_daily_revenue:
          call: googleapis.bigquery.v2.jobs.query
          args:
            projectId: ${var.project_id}
            body:
              useLegacySql: false
              query: |
                MERGE `${var.project_id}.${var.marts_dataset_id}.fact_daily_revenue` T
                USING (
                  SELECT
                    DATE(event_timestamp) AS order_date,
                    COUNTIF(event_type = 'CHECKOUT') AS total_orders,
                    COALESCE(SUM(CASE WHEN event_type = 'CHECKOUT' THEN order_amount ELSE 0 END), 0.0) AS total_revenue,
                    COUNT(DISTINCT user_id) AS unique_customers,
                    CURRENT_TIMESTAMP() AS refreshed_at
                  FROM `${var.project_id}.${var.raw_dataset_id}.events_stream`
                  WHERE event_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
                  GROUP BY 1
                ) S
                ON T.order_date = S.order_date
                WHEN MATCHED THEN
                  UPDATE SET
                    total_orders = S.total_orders,
                    total_revenue = S.total_revenue,
                    unique_customers = S.unique_customers,
                    refreshed_at = S.refreshed_at
                WHEN NOT MATCHED THEN
                  INSERT (order_date, total_orders, total_revenue, unique_customers, refreshed_at)
                  VALUES (S.order_date, S.total_orders, S.total_revenue, S.unique_customers, S.refreshed_at)
          result: query_result
      - return_summary:
          return: $${query_result.jobComplete}
  EOF
}

resource "google_cloud_scheduler_job" "daily_trigger" {
  name        = "${var.name_prefix}-daily-wf-trigger"
  description = "Triggers the Serverless Lakehouse Cloud Workflow at 02:00 UTC daily (Paused by default)"
  schedule    = "0 2 * * *"
  time_zone   = "Etc/UTC"
  region      = var.region
  paused      = true

  http_target {
    http_method = "POST"
    uri         = "https://workflowexecutions.googleapis.com/v1/${google_workflows_workflow.daily_lakehouse_wf.id}/executions"
    oauth_token {
      service_account_email = var.sa_orchestrate_email
    }
  }
}
