window.SIMULATION_FLOWS = {
  valid: {
    cssClass: "active-valid",
    steps_vi: [
      { node: "simulator", badge: "BƯỚC 1/5", text: "💻 Event Simulator tạo 1 đơn hàng hợp lệ (`CHECKOUT`, $149.99) và bắn lên đám mây." },
      { node: "pubsub", badge: "BƯỚC 2/5", text: "📨 Cloud Pub/Sub nhận bản tin tức thì vào `pde-dev-events-topic` (chống nghẽn khi tải cao)." },
      { node: "dataflow", badge: "BƯỚC 3/5", text: "🌊 Dataflow (Apache Beam) kiểm tra chuẩn Schema, gán nhãn thời gian (Watermark) và gom khung 1 phút." },
      { node: "bigquery", badge: "BƯỚC 4/5", text: "🏛️ Dữ liệu sạch được ghi vào bảng phân vùng `raw.events_stream` & tổng hợp sang `marts.fact_daily_revenue`." },
      { node: "bqml", badge: "BƯỚC 5/5", text: "🧠 BigQuery ML & Policy Tags tự động bảo vệ cột Email khách hàng và cập nhật dự báo doanh thu!" }
    ],
    steps_en: [
      { node: "simulator", badge: "STEP 1/5", text: "💻 Event Simulator emits a valid e-commerce checkout event (`CHECKOUT`, $149.99)." },
      { node: "pubsub", badge: "STEP 2/5", text: "📨 Cloud Pub/Sub buffers the message reliably in `pde-dev-events-topic`." },
      { node: "dataflow", badge: "STEP 3/5", text: "🌊 Dataflow (Apache Beam) validates schema, assigns event-time watermarks, and windows metrics." },
      { node: "bigquery", badge: "STEP 4/5", text: "🏛️ Valid records land in partitioned `raw.events_stream` and refresh `marts.fact_daily_revenue`." },
      { node: "bqml", badge: "STEP 5/5", text: "🧠 Policy Tags mask customer PII while BigQuery ML updates churn & revenue predictions!" }
    ]
  },
  dlq: {
    cssClass: "active-dlq",
    steps_vi: [
      { node: "simulator", badge: "LỖI 1/4", text: "⚠️ Simulator cố tình gửi 1 bản ghi bị lỗi (`order_amount: -99.95` hoặc JSON bị đứt đoạn)." },
      { node: "pubsub", badge: "LỖI 2/4", text: "📨 Pub/Sub vẫn tiếp nhận bản tin và chuyển cho tầng xử lý kiểm tra." },
      { node: "dataflow", badge: "LỖI 3/4", text: "🛡️ Dataflow phát hiện vi phạm Data Contract! Thay vì làm sập pipeline, nó gắn thẻ `TaggedOutput('dlq')`." },
      { node: "dlq", badge: "LỖI 4/4", text: "🗑️ Bản ghi lỗi bị cô lập an toàn vào `raw.malformed_events` kèm lý do `NEGATIVE_ORDER_AMOUNT` để kỹ sư kiểm tra!" }
    ],
    steps_en: [
      { node: "simulator", badge: "DLQ 1/4", text: "⚠️ Simulator injects a corrupted record (`order_amount: -99.95` or malformed JSON)." },
      { node: "pubsub", badge: "DLQ 2/4", text: "📨 Pub/Sub delivers the raw payload to the streaming consumer." },
      { node: "dataflow", badge: "DLQ 3/4", text: "🛡️ Dataflow catches the Data Contract violation and routes it via `TaggedOutput('dlq')` without crashing." },
      { node: "dlq", badge: "DLQ 4/4", text: "🗑️ The bad record is safely quarantined in `raw.malformed_events` with `NEGATIVE_ORDER_AMOUNT` metadata!" }
    ]
  },
  batch: {
    cssClass: "active-batch",
    steps_vi: [
      { node: "gcs_raw", badge: "BATCH 1/5", text: "🪣 Hàng ngàn file đơn hàng lịch sử (JSON/CSV) được tập kết tại kho `GCS Raw Bucket`." },
      { node: "dataproc", badge: "BATCH 2/5", text: "⚡ Dataproc Serverless bật cụm PySpark trong vài phút, khử trùng lặp và nén thành chuẩn Parquet." },
      { node: "gcs_curated", badge: "BATCH 3/5", text: "📚 File Parquet sạch được lưu vào `GCS Curated Bucket` và kết nối qua cầu nối `BigLake`." },
      { node: "bigquery", badge: "BATCH 4/5", text: "🏛️ Dataform chạy SQLX biến đổi dữ liệu và kiểm tra chất lượng (Assertions: không trùng, không rỗng)." },
      { node: "orchestration", badge: "BATCH 5/5", text: "🎼 Cloud Workflows hoàn tất chu trình điều phối tự động với chi phí $0.00!" }
    ],
    steps_en: [
      { node: "gcs_raw", badge: "BATCH 1/5", text: "🪣 Raw historical JSON/CSV order batches land in the `GCS Raw Bucket`." },
      { node: "dataproc", badge: "BATCH 2/5", text: "⚡ Dataproc Serverless runs PySpark deduplication and writes partitioned Parquet files." },
      { node: "gcs_curated", badge: "BATCH 3/5", text: "📚 Curated Parquet files are exposed to BigQuery via the `BigLake` connection." },
      { node: "bigquery", badge: "BATCH 4/5", text: "🏛️ Dataform executes SQLX transformations and verifies data quality assertions." },
      { node: "orchestration", badge: "BATCH 5/5", text: "🎼 Cloud Workflows completes the automated daily orchestration at $0.00 cost!" }
    ]
  }
};
