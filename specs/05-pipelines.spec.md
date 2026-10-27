# SPEC 05: Data Pipeline Behavior Specifications

## 1. Synthetic Event Simulator (`pipelines/simulator/generate_events.py`)
- Must support two output modes:
  1. `--mode local`: Writes newline-delimited JSON (NDJSON) locally for free unit testing and `DirectRunner` execution.
  2. `--mode pubsub`: Publishes JSON messages directly to `${prefix}-events-topic`.
- Must deterministically inject:
  - `90%` valid e-commerce & telemetry events.
  - `5%` **late-arriving events** (`event_timestamp` backdated by 120 seconds) to test Apache Beam watermarks and `allowed_lateness`.
  - `5%` **malformed events** (negative `order_amount` or invalid `event_type`) to test Dead-Letter Queue (DLQ) routing.

---

## 2. Streaming Apache Beam Pipeline (`pipelines/streaming_beam/main.py`)
- **Core Transforms**:
  1. `ParseAndValidateEvent(beam.DoFn)`:
     - Parses raw JSON string.
     - Emits valid records to the main output with `ingestion_timestamp` populated.
     - Emits invalid records via `beam.pvalue.TaggedOutput("dlq", error_dict)` matching the `raw.malformed_events` schema.
  2. `AssignEventTimestamp(beam.DoFn)`:
     - Wraps each valid event in `beam.window.TimestampedValue(element, event_epoch_seconds)`.
  3. `WindowAndAggregate`:
     - Applies `beam.WindowInto(FixedWindows(60), trigger=AfterWatermark(early=AfterProcessingTime(15), late=AfterCount(1)), accumulation_mode=AccumulationMode.ACCUMULATING, allowed_lateness=300)`.
  4. `FormatBigtableRowKey` (Pure helper function):
     - Computes `<salt>#<user_id>#<reverse_timestamp_ms>` per Contract 3 in `specs/02-data-contracts.spec.md`.

---

## 3. PySpark Lakehouse Job (`pipelines/spark_jobs/orders_raw_to_curated.py`)
- Reads raw JSON/CSV order records from `gs://<raw-bucket>/orders/`.
- Deduplicates records by `order_id` keeping the latest `event_timestamp` via a Spark Window function (`row_number() OVER (PARTITION BY order_id ORDER BY event_timestamp DESC) = 1`).
- Adds derived partition column `order_date = to_date(event_timestamp)`.
- Writes Snappy-compressed Parquet partitioned by `order_date` to `gs://<curated-bucket>/orders/`.

---

## 4. Dataform SQLX & BigQuery ML (`pipelines/dataform/` & `pipelines/bqml/`)
- **Dataform (`pipelines/dataform/definitions/`)**:
  - `stg_events.sqlx`: Incremental view/table deduplicating `raw.events_stream` with partition pruning.
  - `dim_customers.sqlx`: Customer dimension table with `uniqueKey: ["user_id"]` assertion.
  - `fact_daily_revenue.sqlx`: Aggregated daily revenue mart with `nonNull: ["order_date", "total_revenue"]` assertion.
- **BigQuery ML (`pipelines/bqml/`)**:
  - `churn_logistic_reg.sql`: Trains a `LOGISTIC_REG` model using `TRANSFORM()` for automatic feature preprocessing (`ML.STANDARD_SCALER`, `ML.ONE_HOT_ENCODER`), evaluates with `ML.EVALUATE`, and explains predictions with `ML.EXPLAIN_PREDICT`.
  - `revenue_forecast_arima.sql`: Trains an `ARIMA_PLUS` time-series model with `auto_arima = TRUE` and `holiday_region = 'US'`.
