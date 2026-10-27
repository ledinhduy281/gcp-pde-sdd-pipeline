# SPEC 02: Data Contracts & Storage Schemas

## 1. Objective
Define strict schemas, partitioning strategies, clustering keys, Dead-Letter Queue (DLQ) payloads, and NoSQL row keys across all pipeline stages to prevent schema drift and test high-value **Google Cloud Professional Data Engineer (PDE)** exam patterns.

---

## 2. Contract 1: Real-Time Telemetry & E-Commerce Events (`Pub/Sub` -> `Apache Beam` -> `BigQuery`)

### 2.1. Input JSON Payload (`pde-dev-events-topic`)
```json
{
  "event_id": "550e8400-e29b-41d4-a716-446655440000",
  "event_timestamp": "2026-10-27T02:30:00Z",
  "user_id": "USR-001042",
  "session_id": "SES-99812",
  "event_type": "CHECKOUT",
  "order_amount": 149.99,
  "customer_email": "alice@example.com",
  "device_os": "iOS",
  "geo_lat": 10.762622,
  "geo_lon": 106.660172
}
```

### 2.2. Validation Rules & Dead-Letter Routing
A record is routed to the **Dead-Letter Queue (`raw.malformed_events`)** via `TaggedOutput('dlq')` if ANY of the following conditions occur:
1. Payload is not valid UTF-8 JSON.
2. Required fields (`event_id`, `event_timestamp`, `user_id`, `event_type`) are missing or empty.
3. `event_type` is not in `{"PAGE_VIEW", "ADD_TO_CART", "CHECKOUT", "GPS_PING"}`.
4. `order_amount` is present and `< 0.0`.

---

## 3. Contract 2: BigQuery Warehouse Schemas (`infra/modules/bigquery_dwh`)

### 3.1. Table `raw.events_stream`
- **Partitioning**: `DAY` on column `event_timestamp` with `require_partition_filter = true`.
- **Clustering**: `["event_type", "user_id"]`.
- **Columns**:
  - `event_id` (`STRING`, `REQUIRED`)
  - `event_timestamp` (`TIMESTAMP`, `REQUIRED`)
  - `ingestion_timestamp` (`TIMESTAMP`, `REQUIRED`)
  - `user_id` (`STRING`, `REQUIRED`)
  - `session_id` (`STRING`, `NULLABLE`)
  - `event_type` (`STRING`, `REQUIRED`)
  - `order_amount` (`FLOAT64`, `NULLABLE`)
  - `customer_email` (`STRING`, `NULLABLE`)
  - `device_os` (`STRING`, `NULLABLE`)
  - `geo_lat` (`FLOAT64`, `NULLABLE`)
  - `geo_lon` (`FLOAT64`, `NULLABLE`)

### 3.2. Table `raw.malformed_events` (Dead-Letter Sink)
- **Partitioning**: `DAY` on column `failed_at`.
- **Columns**:
  - `raw_payload` (`STRING`, `REQUIRED`)
  - `error_reason` (`STRING`, `REQUIRED`)
  - `pipeline_step` (`STRING`, `REQUIRED`)
  - `failed_at` (`TIMESTAMP`, `REQUIRED`)

### 3.3. Table `marts.dim_customers` (Column-Level Security Contract)
- **Columns**:
  - `user_id` (`STRING`, `REQUIRED`)
  - `customer_email` (`STRING`, `NULLABLE`, attached with `policy_tags = [pii_high_sensitivity]`)
  - `loyalty_tier` (`STRING`, `NULLABLE`)
  - `region` (`STRING`, `NULLABLE`)
  - `updated_at` (`TIMESTAMP`, `REQUIRED`)

---

## 4. Contract 3: Cloud Bigtable Anti-Hotspotting Schema (`user_activity_serving`)

- **Table Name**: `user_activity_serving`
- **Column Family**: `cf_metrics` (`max_versions = 1`, `max_age = 168h`)
- **Row Key Formula**:
  ```text
  <salt_digit>#<user_id>#<reverse_epoch_millis>
  ```
  - `salt_digit`: `abs(hash(user_id)) % 4` (`0..3`) — prevents hotspotting across tablet nodes.
  - `reverse_epoch_millis`: `9999999999999 - int(event_timestamp_ms)` — orders newest events first for fast prefix scans.
