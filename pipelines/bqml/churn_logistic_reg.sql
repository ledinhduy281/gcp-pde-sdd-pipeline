-- =============================================================================
-- Excelerate-Jinder BigQuery ML Lab 1: Shortlist & Retention Classification
-- Uses Jinder's Canonical Mathematical Scores (F-01 SMF, F-02 GSI, F-05 FRS, F-06 TSS)
-- inside TRANSFORM() with ML.STANDARD_SCALER & ML.ONE_HOT_ENCODER.
-- =============================================================================

CREATE OR REPLACE MODEL `ml.jinder_shortlist_logreg`
TRANSFORM(
  ML.STANDARD_SCALER(avg_frs_score) OVER () AS scaled_frs,
  ML.STANDARD_SCALER(avg_smf_score) OVER () AS scaled_smf,
  ML.STANDARD_SCALER(avg_gsi_score) OVER () AS scaled_gsi,
  ML.STANDARD_SCALER(avg_tss_score) OVER () AS scaled_tss,
  ML.ONE_HOT_ENCODER(preferred_work_mode) OVER () AS encoded_work_mode,
  is_shortlisted
)
OPTIONS(
  model_type = 'LOGISTIC_REG',
  input_label_cols = ['is_shortlisted'],
  auto_class_weights = TRUE,
  data_split_method = 'AUTO_SPLIT'
) AS
WITH seeker_features AS (
  SELECT
    user_id,
    ANY_VALUE(device_os) AS preferred_work_mode,
    AVG(COALESCE(frs_score, 70.0)) AS avg_frs_score,
    AVG(COALESCE(smf_score, 70.0)) AS avg_smf_score,
    AVG(COALESCE(gsi_score, 15.0)) AS avg_gsi_score,
    AVG(COALESCE(tss_score, 70.0)) AS avg_tss_score,
    IF(COUNTIF(event_type IN ('JOB_APPLY', 'CHECKOUT')) > 0 AND AVG(COALESCE(frs_score, 0)) >= 75.0, 1, 0) AS is_shortlisted
  FROM `raw.events_stream`
  WHERE event_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
  GROUP BY user_id
)
SELECT * FROM seeker_features;

-- Evaluate ROC_AUC, Precision, Recall & Explainable AI Feature Attributions
SELECT * FROM ML.EVALUATE(MODEL `ml.jinder_shortlist_logreg`);
