-- =============================================================================
-- BigQuery ML Lab 2: Daily Revenue Time-Series Forecasting with ARIMA_PLUS
-- PDE Exam Concepts: Automated seasonality detection, holiday effects, anomaly detection.
-- =============================================================================

CREATE OR REPLACE MODEL `ml.daily_revenue_forecast`
OPTIONS(
  model_type = 'ARIMA_PLUS',
  time_series_timestamp_col = 'order_date',
  time_series_data_col = 'total_revenue',
  auto_arima = TRUE,
  data_frequency = 'DAILY',
  holiday_region = 'US'
) AS
SELECT
  order_date,
  total_revenue
FROM
  `marts.fact_daily_revenue`;

-- Forecast next 14 days with 90% confidence interval
SELECT * FROM ML.FORECAST(MODEL `ml.daily_revenue_forecast`, STRUCT(14 AS horizon, 0.90 AS confidence_level));
