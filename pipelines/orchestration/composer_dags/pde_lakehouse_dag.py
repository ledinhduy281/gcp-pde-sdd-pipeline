"""Cloud Composer (Apache Airflow) DAG for Week 6 Orchestration Lab."""

from datetime import datetime, timedelta
from airflow import DAG
from airflow.providers.google.cloud.operators.bigquery import BigQueryInsertJobOperator

DEFAULT_ARGS = {
    "owner": "pde-candidate",
    "depends_on_past": False,
    "retries": 2,
    "retry_delay": timedelta(minutes=5),
}

with DAG(
    dag_id="pde_daily_lakehouse_elt",
    default_args=DEFAULT_ARGS,
    schedule_interval="0 2 * * *",
    start_date=datetime(2026, 1, 1),
    catchup=False,
    tags=["pde", "lakehouse", "bigquery"],
) as dag:
    refresh_daily_revenue = BigQueryInsertJobOperator(
        task_id="refresh_fact_daily_revenue",
        configuration={
            "query": {
                "query": """
                SELECT
                  DATE(event_timestamp) AS order_date,
                  COUNTIF(event_type = 'CHECKOUT') AS total_orders,
                  SUM(COALESCE(order_amount, 0.0)) AS total_revenue,
                  COUNT(DISTINCT user_id) AS unique_customers,
                  CURRENT_TIMESTAMP() AS refreshed_at
                FROM `raw.events_stream`
                WHERE event_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 DAY)
                GROUP BY 1
                """,
                "useLegacySql": False,
            }
        },
    )
