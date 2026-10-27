-- =============================================================================
-- BigQuery ML Lab 1: Customer Churn Classification with TRANSFORM & EXPLAIN_PREDICT
-- PDE Exam Concepts: Feature preprocessing inside TRANSFORM(), Class weights,
--                    ML.EVALUATE, and Explainable AI (ML.EXPLAIN_PREDICT).
-- =============================================================================

CREATE OR REPLACE MODEL `ml.customer_churn_logreg`
TRANSFORM(
  ML.STANDARD_SCALER(total_spend_30d) OVER () AS scaled_spend,
  ML.STANDARD_SCALER(session_count_30d) OVER () AS scaled_sessions,
  ML.ONE_HOT_ENCODER(device_os) OVER () AS encoded_os,
  is_churned
)
OPTIONS(
  model_type = 'LOGISTIC_REG',
  input_label_cols = ['is_churned'],
  auto_class_weights = TRUE,
  data_split_method = 'AUTO_SPLIT'
) AS
WITH user_features AS (
  SELECT
    user_id,
    ANY_VALUE(device_os) AS device_os,
    SUM(COALESCE(order_amount, 0.0)) AS total_spend_30d,
    COUNT(DISTINCT session_id) AS session_count_30d,
    IF(MAX(event_timestamp) < TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 14 DAY), 1, 0) AS is_churned
  FROM `raw.events_stream`
  WHERE event_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
  GROUP BY user_id
)
SELECT * FROM user_features;

-- Evaluate ROC_AUC, Precision, and Recall
SELECT * FROM ML.EVALUATE(MODEL `ml.customer_churn_logreg`);
