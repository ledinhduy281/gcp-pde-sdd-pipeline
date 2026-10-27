# SPEC 05: Excelerate-Jinder Application & Data Pipeline Behavior Specifications

## 1. Local Excelerate-Jinder Web Platform (`jinder_platform/`, `jinder_backend_engine/`, `jinder_frontend/`)
- **Entrypoint**: `python3 jinder_platform/start.py --demo` (or `make run-jinder-local`).
- **Capabilities**:
  - Serves the Talent and Employer web portals on `http://localhost:8095/`.
  - Evaluates all 6 mathematical formulas (`01_skill_matching_model.py` through `06_recruiter_candidate_ranking.py`) against `jinder_backend_engine/data/reference/ict_taxonomy.json`.
  - Enforces `REQ-A07` Zero-PII separation in SQLite (`jinder_platform/var/jinder.db`).

---

## 2. Jinder Corpus Event Simulator (`pipelines/simulator/generate_events.py`)
- Automatically loads real synthetic Jobs (`jinder_backend_engine/data/synthetic/jobs.json`) and Talents (`talents.json`).
- Emits JSON events containing real Jinder Talent aliases (e.g., `Sage Swift`, `Plum Wombat`, `Cyan Puffin`), Australian `anzsco_code` values, and calculated `smf_score`, `gsi_score`, `frs_score`, and `tss_score` metrics.
- Deterministically injects:
  - `90%` valid real-time events.
  - `5%` late-arriving events (backdated by 120s to test Apache Beam watermarks).
  - `5%` malformed events (corrupted JSON or negative `order_amount` to test DLQ routing).

---

## 3. Streaming Apache Beam Pipeline (`pipelines/streaming_beam/main.py`)
- **`validate_and_parse_event`**:
  - Validates JSON payload against SPEC-02 Contract 1.
  - Routes malformed payloads or negative salaries/amounts to `raw.malformed_events` with `error_reason` and `failed_at`.
- **`compute_jinder_behavioral_frs`**:
  - Implements Jinder's Behavioural Ranking Feedback Loop:
    $$FRS^*(J \mid C) = \min\left(100,\; FRS(J \mid C) \cdot \left(1 + \Delta_{\text{save}} - \Delta_{\text{ignore}}\right)\right)$$
- **`compute_bigtable_row_key`**:
  - Produces `<salt_digit>#<user_id>#<reverse_epoch_millis>` to prevent Bigtable tablet hotspotting.

---

## 4. PySpark Lakehouse Curation Job (`pipelines/spark_jobs/orders_raw_to_curated.py`)
- Reads raw JSON/NDJSON records from `gs://<raw-bucket>/`, filters out negative amounts, deduplicates by `event_id` keeping the latest `event_timestamp` via a Spark Window function, and writes Snappy-compressed Parquet partitioned by `order_date` to `gs://<curated-bucket>/`.

---

## 5. Dataform SQLX & BigQuery ML (`pipelines/dataform/` & `pipelines/bqml/`)
- **Dataform (`pipelines/dataform/definitions/`)**:
  - `stg_events.sqlx`: Deduplicates `raw.events_stream` using `QUALIFY ROW_NUMBER() OVER (PARTITION BY event_id ORDER BY ingestion_timestamp DESC) = 1`.
  - `fact_daily_revenue.sqlx`: Incremental daily aggregation with `uniqueKey` and `nonNull` assertions.
- **BigQuery ML (`pipelines/bqml/`)**:
  - `churn_logistic_reg.sql`: Trains `ml.jinder_shortlist_logreg` using `TRANSFORM(ML.STANDARD_SCALER(avg_frs_score), ML.STANDARD_SCALER(avg_smf_score), ML.STANDARD_SCALER(avg_gsi_score), ML.STANDARD_SCALER(avg_tss_score), ML.ONE_HOT_ENCODER(preferred_work_mode))` to predict candidate shortlist probability.
  - `revenue_forecast_arima.sql`: Trains `ml.daily_revenue_forecast` using `ARIMA_PLUS`.
