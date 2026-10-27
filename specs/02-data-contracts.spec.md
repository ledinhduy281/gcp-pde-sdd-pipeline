# SPEC 02: Excelerate-Jinder Data Contracts, Mathematical Scores & Storage Schemas

## 1. Objective
Define strict schemas, Jinder mathematical alignment scores (`F-01` through `F-06`), partitioning strategies, clustering keys, Dead-Letter Queue (DLQ) payloads, Zero-PII Policy Tags (`REQ-A07`), and Cloud Bigtable anti-hotspotting row keys across all pipeline stages.

---

## 2. Contract 1: Real-Time Jinder Engagement & Application Events (`Pub/Sub` -> `Apache Beam` -> `BigQuery`)

### 2.1. Input JSON Payload (`pde-dev-events-topic`)
Generated from real Jinder Talent (`jinder_backend_engine/data/synthetic/talents.json`) and Job (`jobs.json`) records:
```json
{
  "event_id": "550e8400-e29b-41d4-a716-446655440000",
  "event_timestamp": "2026-10-27T02:30:00Z",
  "user_id": "Plum Wombat",
  "session_id": "SES-00010",
  "job_id": "JOB-AU-0010",
  "anzsco_code": "261313",
  "event_type": "JOB_APPLY",
  "order_amount": 157938.72,
  "frs_score": 84.8,
  "smf_score": 87.1,
  "gsi_score": 18.0,
  "tss_score": 86.2,
  "customer_email": "seeker10@jinder.app",
  "device_os": "Hybrid",
  "geo_lat": -33.8688,
  "geo_lon": 151.2093
}
```

### 2.2. Canonical Mathematical Score Definitions (`jinder_backend_engine/intelligence_engine/`)
- **`smf_score` (F-01 SMF)**: Skill Match Frequency & Coverage (`0..100`), weighting mandatory skills ($w=2.0$) vs preferred skills ($w=1.0$).
- **`gsi_score` (F-02 GSI)**: Gap Severity Index (`0..100`), distinguishing statutory blockers (e.g., AHPRA registration) from learnable tools.
- **`frs_score` (F-05 FRS)**: Feed Ranking Score (`0..100`), where platform display score is $0.55 \cdot \text{fit} + 0.45 \cdot FRS^*$.
- **`tss_score` (F-06 TSS)**: Employer Talent Search Score (`0..100`), computed on anonymized profiles ($0.60 \cdot \text{coverage} + 0.40 \cdot TSS$).

### 2.3. Behavioural Ranking Feedback Loop Contract
Implemented in `pipelines/streaming_beam/main.py` (`compute_jinder_behavioral_frs`):
$$FRS^*(J \mid C) = \min\left(100,\; FRS(J \mid C) \cdot \left(1 + \Delta_{\text{save}} - \Delta_{\text{ignore}}\right)\right)$$
- **Save Affinity ($\Delta_{\text{save}}$)**: $+0.10$ if the talent saved a job from the same employer; $+0.05$ if in the same domain.
- **Ignore Penalty ($\Delta_{\text{ignore}}$)**: $0.25$ if the talent skipped $\ge 3$ jobs from the same employer.

### 2.4. Validation Rules & Dead-Letter Routing (`raw.malformed_events`)
A record is routed to the **Dead-Letter Queue (`raw.malformed_events`)** if ANY of the following occur:
1. Payload is not valid UTF-8 JSON.
2. Required fields (`event_id`, `event_timestamp`, `user_id`, `event_type`) are missing or empty.
3. `event_type` is not in `{"PAGE_VIEW", "ADD_TO_CART", "CHECKOUT", "GPS_PING", "JOB_VIEW", "JOB_SAVE", "JOB_IGNORE", "JOB_APPLY"}`.
4. `order_amount` (annualized salary / transaction value) is `< 0.0`.

---

## 3. Contract 2: BigQuery Star Schema (`infra/modules/bigquery_dwh`)

### 3.1. Table `raw.events_stream`
- **Partitioning**: `DAY` on column `event_timestamp` with `require_partition_filter = true`.
- **Clustering**: `["event_type", "user_id"]`.
- **Columns**: `event_id`, `event_timestamp`, `ingestion_timestamp`, `user_id`, `session_id`, `job_id`, `anzsco_code`, `event_type`, `order_amount`, `frs_score`, `smf_score`, `gsi_score`, `tss_score`, `customer_email`, `device_os`, `geo_lat`, `geo_lon`.

### 3.2. Table `raw.malformed_events` (Dead-Letter Sink)
- **Partitioning**: `DAY` on column `failed_at`.
- **Columns**: `raw_payload`, `error_reason`, `pipeline_step`, `failed_at`.

### 3.3. Table `marts.dim_customers` (Jinder Seekers with Zero-PII Policy Tag `REQ-A07`)
- **Clustering**: `["region", "loyalty_tier"]`.
- **Columns**:
  - `user_id` (`STRING`, `REQUIRED`)
  - `alias` (`STRING`, `NULLABLE` — Public anonymized identity shown to Employers)
  - `customer_email` (`STRING`, `NULLABLE` — Protected by `policy_tags = [pii_high_sensitivity]`)
  - `origin_country` (`STRING`, `NULLABLE`)
  - `target_anzsco_code` (`STRING`, `NULLABLE`)
  - `years_experience` (`FLOAT64`, `NULLABLE`)
  - `loyalty_tier` (`STRING`, `NULLABLE` — Seniority rank `Intern..Principal`)
  - `region` (`STRING`, `NULLABLE`)
  - `updated_at` (`TIMESTAMP`, `REQUIRED`)

### 3.4. Table `marts.dim_jobs` (Jinder Normalized Australian & ICT Jobs)
- **Clustering**: `["category", "anzsco_code"]`.
- **Columns**: `job_id`, `title`, `company`, `category`, `anzsco_code`, `work_mode`, `annual_salary_min`, `annual_salary_max` (normalized via `year * 1`, `day * 220`, `hour * 1950`), `updated_at`.

### 3.5. Table `marts.fact_daily_revenue`
- **Partitioning**: `DAY` on `order_date`.
- **Columns**: `order_date`, `total_orders`, `total_revenue`, `unique_customers`, `avg_frs_score`, `refreshed_at`.

---

## 4. Contract 3: Cloud Bigtable Anti-Hotspotting Schema (`user_activity_serving`)
- **Table Name**: `user_activity_serving`
- **Column Family**: `cf_metrics` (`max_versions = 1`, `max_age = 168h`)
- **Row Key Formula**: `<salt_digit>#<user_id>#<reverse_epoch_millis>` where `salt_digit = md5(user_id) % 4` and `reverse_epoch_millis = 9999999999999 - epoch_ms`.
