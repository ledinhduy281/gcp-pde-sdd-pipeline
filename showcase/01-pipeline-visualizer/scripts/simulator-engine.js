window.SIMULATION_FLOWS = {
  valid: {
    cssClass: "active-valid",
    steps_vi: [
      { node: "simulator", badge: "JINDER 1/5", text: "💻 Ứng viên 'Plum Wombat' trên Jinder bấm Ứng tuyển (`JOB_APPLY`, ANZSCO 261313) kèm điểm khớp kỹ năng SMF = 87.1, FRS = 84.8." },
      { node: "pubsub", badge: "JINDER 2/5", text: "📨 Cloud Pub/Sub tiếp nhận sự kiện tức thì vào `pde-dev-events-topic` (chống nghẽn khi hàng ngàn ứng viên nộp CV cùng lúc)." },
      { node: "dataflow", badge: "JINDER 3/5", text: "🌊 Dataflow (Apache Beam) tính vòng lặp hành vi `FRS*(J|C) = min(100, FRS * (1 + delta_save - delta_ignore))` và gom khung 1 phút." },
      { node: "bigquery", badge: "JINDER 4/5", text: "🏛️ Dữ liệu lưu vào `raw.events_stream` & cập nhật bảng `marts.dim_customers` (Policy Tag tự động che Email ứng viên theo chuẩn Zero-PII REQ-A07)." },
      { node: "bqml", badge: "JINDER 5/5", text: "🧠 BigQuery ML (`ml.jinder_shortlist_logreg`) chấm điểm xác suất ứng viên vào vòng Phỏng vấn từ 4 chỉ số toán học F-01..F-06!" }
    ],
    steps_en: [
      { node: "simulator", badge: "JINDER 1/5", text: "💻 Jinder candidate 'Plum Wombat' submits `JOB_APPLY` (ANZSCO 261313) with SMF = 87.1 and FRS = 84.8." },
      { node: "pubsub", badge: "JINDER 2/5", text: "📨 Cloud Pub/Sub buffers the real-time event reliably in `pde-dev-events-topic`." },
      { node: "dataflow", badge: "JINDER 3/5", text: "🌊 Dataflow (Apache Beam) computes the Jinder behavioral feedback loop `FRS*(J|C)` and assigns event-time watermarks." },
      { node: "bigquery", badge: "JINDER 4/5", text: "🏛️ Valid records land in `raw.events_stream` while `marts.dim_customers` enforces Zero-PII Policy Tags (REQ-A07)." },
      { node: "bqml", badge: "JINDER 5/5", text: "🧠 BigQuery ML (`ml.jinder_shortlist_logreg`) predicts shortlist probability using Jinder's F-01..F-06 scores!" }
    ]
  },
  dlq: {
    cssClass: "active-dlq",
    steps_vi: [
      { node: "simulator", badge: "LỖI 1/4", text: "⚠️ Một tin tuyển dụng bị lỗi dữ liệu (`order_amount: -99.95` mức lương âm hoặc JSON bị đứt đoạn) được gửi lên." },
      { node: "pubsub", badge: "LỖI 2/4", text: "📨 Pub/Sub vẫn tiếp nhận bản tin và chuyển cho tầng xử lý kiểm tra Data Contract." },
      { node: "dataflow", badge: "LỖI 3/4", text: "🛡️ Dataflow phát hiện vi phạm hợp đồng dữ liệu của Jinder! Thay vì làm sập pipeline, nó gắn thẻ `TaggedOutput('dlq')`." },
      { node: "dlq", badge: "LỖI 4/4", text: "🗑️ Bản ghi lỗi bị cô lập an toàn vào `raw.malformed_events` kèm lý do `NEGATIVE_ORDER_AMOUNT` để Admin Jinder kiểm tra!" }
    ],
    steps_en: [
      { node: "simulator", badge: "DLQ 1/4", text: "⚠️ A corrupted job/application payload (`order_amount: -99.95` negative salary or broken JSON) is emitted." },
      { node: "pubsub", badge: "DLQ 2/4", text: "📨 Pub/Sub delivers the raw payload to the streaming consumer." },
      { node: "dataflow", badge: "DLQ 3/4", text: "🛡️ Dataflow catches the Data Contract violation and routes it via `TaggedOutput('dlq')` without crashing." },
      { node: "dlq", badge: "DLQ 4/4", text: "🗑️ The bad record is safely quarantined in `raw.malformed_events` with `NEGATIVE_ORDER_AMOUNT` metadata!" }
    ]
  },
  batch: {
    cssClass: "active-batch",
    steps_vi: [
      { node: "gcs_raw", badge: "BATCH 1/5", text: "🪣 Bộ dataset thật của Jinder (`australian_jobs_dataset.csv`, `international_candidates_dataset.csv`, `talents.json`, `ict_taxonomy.json`) được đưa vào `GCS Raw Bucket`." },
      { node: "dataproc", badge: "BATCH 2/5", text: "⚡ Dataproc Serverless chạy PySpark quy đổi lương năm (`hour*1950`, `day*220`), chuẩn hóa mã nghề Úc ANZSCO và nén thành Parquet." },
      { node: "gcs_curated", badge: "BATCH 3/5", text: "📚 File Parquet sạch được lưu vào `GCS Curated Bucket` và kết nối qua cầu nối `BigLake`." },
      { node: "bigquery", badge: "BATCH 4/5", text: "🏛️ Dataform chạy SQLX cập nhật bảng `marts.dim_jobs`, `marts.dim_customers` và `marts.fact_daily_revenue`." },
      { node: "orchestration", badge: "BATCH 5/5", text: "🎼 Cloud Workflows hoàn tất chu trình điều phối tự động cho nền tảng Jinder với chi phí $0.00!" }
    ],
    steps_en: [
      { node: "gcs_raw", badge: "BATCH 1/5", text: "🪣 Jinder's real datasets (`australian_jobs_dataset.csv`, `international_candidates_dataset.csv`, `talents.json`, `ict_taxonomy.json`) land in `GCS Raw Bucket`." },
      { node: "dataproc", badge: "BATCH 2/5", text: "⚡ Dataproc Serverless runs PySpark salary normalization (`hour*1950`, `day*220`) and writes partitioned Parquet." },
      { node: "gcs_curated", badge: "BATCH 3/5", text: "📚 Curated Parquet files are exposed to BigQuery via the `BigLake` connection." },
      { node: "bigquery", badge: "BATCH 4/5", text: "🏛️ Dataform executes SQLX transformations to populate `marts.dim_jobs`, `marts.dim_customers`, and `marts.fact_daily_revenue`." },
      { node: "orchestration", badge: "BATCH 5/5", text: "🎼 Cloud Workflows completes the automated daily Jinder Lakehouse refresh at $0.00 cost!" }
    ]
  }
};
