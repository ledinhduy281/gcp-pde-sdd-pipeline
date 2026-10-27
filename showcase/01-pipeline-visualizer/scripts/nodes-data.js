window.PIPELINE_NODES = {
  simulator: {
    icon: "💻",
    title: "Synthetic Event Simulator",
    tier_vi: "MIỄN PHÍ 100% (Chạy trên máy hoặc Cloud Run)",
    tier_en: "100% FREE (Runs locally or on Cloud Run)",
    analogy_vi: "Hãy tưởng tượng đây là hàng ngàn khách hàng đang lướt web, bấm 'Thêm vào giỏ hàng', 'Thanh toán' và tài xế đang phát tín hiệu GPS mỗi giây.",
    analogy_en: "Think of this as thousands of shoppers clicking 'Add to Cart' and 'Checkout' while delivery drivers ping their GPS coordinates every second.",
    role_vi: "Tự động tạo ra 90% dữ liệu chuẩn, cố tình trộn thêm 5% dữ liệu đến trễ (do mạng lag) và 5% dữ liệu lỗi (số tiền âm) để bạn kiểm chứng độ bền của Pipeline.",
    role_en: "Generates 90% clean events, 5% late-arriving events (network lag), and 5% corrupted records (negative amounts) to test pipeline resilience.",
    pde_vi: [
      "Hiểu sự khác biệt giữa Event Time (lúc khách bấm nút) và Processing Time (lúc server nhận được).",
      "Kiểm thử hệ thống với dữ liệu lỗi trước khi đưa lên môi trường thật."
    ],
    pde_en: [
      "Distinguish between Event Time (when the action occurred) and Processing Time (when the pipeline ingested it).",
      "Validate schema resilience against malformed and late data."
    ],
    code: "pipelines/simulator/generate_events.py",
    ui_vi: "Chạy trực tiếp trên Terminal của Antigravity IDE (`python3 pipelines/simulator/generate_events.py`).",
    ui_en: "Run directly in Antigravity IDE terminal (`python3 pipelines/simulator/generate_events.py`)."
  },
  cloudsql: {
    icon: "🗄️",
    title: "Cloud SQL (PostgreSQL) + Datastream CDC",
    tier_vi: "TẮT MẶC ĐỊNH — Bật khi làm Lab (~$0.03/giờ)",
    tier_en: "OFF BY DEFAULT — Enable for Lab (~$0.03/hr)",
    analogy_vi: "Cloud SQL giống như cuốn sổ cái kế toán ghi nhận từng đơn hàng. Còn Datastream (CDC) là chiếc máy photocopy tự động: hễ sổ cái có dòng mới hay sửa đổi là nó chụp lại ngay lập tức để gửi sang kho phân tích mà không làm chậm web bán hàng.",
    analogy_en: "Cloud SQL is the live cash register database. Datastream (CDC) acts like an instant carbon-copy machine that streams every insert/update to the analytics lakehouse without slowing down checkout.",
    role_vi: "Thực hành đồng bộ dữ liệu thời gian thực (Change Data Capture - CDC) từ cơ sở dữ liệu giao dịch (OLTP) sang Cloud Storage và BigQuery.",
    role_en: "Demonstrates serverless Change Data Capture (CDC) replication from an OLTP relational database into GCS and BigQuery.",
    pde_vi: [
      "Khi nào dùng Cloud SQL (OLTP vùng đơn) vs Cloud Spanner (OLTP toàn cầu mở rộng ngang).",
      "Dùng Datastream để đồng bộ CDC không cần cài agent (Serverless CDC)."
    ],
    pde_en: [
      "Cloud SQL (regional OLTP) vs Cloud Spanner (globally scalable horizontal OLTP).",
      "Using Datastream for low-overhead, serverless Change Data Capture (CDC)."
    ],
    code: "infra/modules/ephemeral_labs/main.tf (enable_cloudsql_cdc)",
    ui_vi: "Menu trái GCP Console -> SQL (xem database) và Datastream -> Streams.",
    ui_en: "GCP Console Left Menu -> SQL and Datastream -> Streams."
  },
  pubsub: {
    icon: "📨",
    title: "Cloud Pub/Sub (Messaging Bus)",
    tier_vi: "LUÔN BẬT — $0.00/tháng (Free Tier 10GB/tháng)",
    tier_en: "ALWAYS ON — $0.00/month (10GB/month Free Tier)",
    analogy_vi: "Giống như sảnh nhận bưu phẩm tự động có đệm giảm chấn: Dù ngày Black Friday khách đặt gấp 100 lần bình thường, Pub/Sub vẫn xếp hàng gọn gàng để nhà máy phía sau xử lý dần mà không bao giờ bị sập.",
    analogy_en: "Acts as a global shock absorber and post office sorting belt: even if traffic spikes 100x on Black Friday, Pub/Sub buffers every message safely until workers process them.",
    role_vi: "Nhận toàn bộ sự kiện thời gian thực từ Simulator/App và giữ lại tối đa 24 giờ cho đến khi Dataflow xử lý xong.",
    role_en: "Ingests real-time telemetry and order events asynchronously with 24-hour message retention.",
    pde_vi: [
      "At-least-once delivery: Pub/Sub đảm bảo tin nhắn được gửi ít nhất 1 lần (nên bước sau cần khử trùng lặp).",
      "Tách rời (Decouple) bên gửi (Publisher) và bên nhận (Subscriber)."
    ],
    pde_en: [
      "At-least-once delivery semantics and message ordering keys.",
      "Decoupling publishers from downstream consumers during traffic spikes."
    ],
    code: "infra/modules/pubsub_messaging/main.tf",
    ui_vi: "Ô tìm kiếm GCP Console -> Gõ 'Pub/Sub' -> Chọn Topics -> `pde-dev-events-topic`.",
    ui_en: "GCP Console Search -> 'Pub/Sub' -> Topics -> `pde-dev-events-topic`."
  },
  dlq: {
    icon: "🗑️",
    title: "Dead-Letter Queue (DLQ Topic & Malformed Table)",
    tier_vi: "LUÔN BẬT — $0.00/tháng (Serverless)",
    tier_en: "ALWAYS ON — $0.00/month (Serverless)",
    analogy_vi: "Trên dây chuyền đóng gói, nếu có 1 chai nước bị méo nắp, cảm biến sẽ gạt riêng chai đó sang 'Khay Hàng Lỗi' (DLQ) để kỹ sư kiểm tra sau, nhờ vậy cả dây chuyền 10.000 chai/phút không bị đứng máy!",
    analogy_en: "On a bottling line, if one bottle is cracked, a sensor diverts it into a 'Reject Bin' (DLQ) for inspection so the main assembly line never halts.",
    role_vi: "Hứng toàn bộ tin nhắn sai định dạng JSON hoặc có số tiền âm (`order_amount < 0`) sang topic `pde-dev-events-dlq-topic` và bảng `raw.malformed_events`.",
    role_en: "Captures unprocessable messages after 5 failed delivery attempts or schema violations into `raw.malformed_events`.",
    pde_vi: [
      "Câu hỏi tủ trong đề thi PDE: 'Làm sao xử lý dữ liệu hỏng trong Streaming mà không làm dừng pipeline?' -> Đáp án: Dùng Dead-Letter Queue (TupleTags / TaggedOutput trong Beam + Pub/Sub DLQ).",
      "Giúp phát hiện lỗi schema sớm và replay lại dữ liệu sau khi sửa lỗi."
    ],
    pde_en: [
      "Classic PDE Exam Pattern: Route corrupted streaming records via Beam `TaggedOutput` to a Dead-Letter table instead of failing the job.",
      "Configure Pub/Sub `dead_letter_policy` with `max_delivery_attempts = 5`."
    ],
    code: "pipelines/streaming_beam/main.py & infra/modules/bigquery_dwh/main.tf",
    ui_vi: "BigQuery -> Dataset `raw` -> Bảng `malformed_events`.",
    ui_en: "BigQuery -> Dataset `raw` -> Table `malformed_events`."
  },
  gcs_raw: {
    icon: "🪣",
    title: "Cloud Storage (GCS Raw & Temp Buckets)",
    tier_vi: "LUÔN BẬT — ~$0.00/tháng (5GB Free Tier)",
    tier_en: "ALWAYS ON — ~$0.00/month (5GB Free Tier)",
    analogy_vi: "Nhà kho rộng vô tận của Google: Bạn có thể cất mọi loại file (CSV, JSON, hình ảnh, Parquet). Đặc biệt có 'Quản kho tự động' (Lifecycle): file nào để quá 30 ngày ít đọc sẽ tự chuyển sang kho lạnh giá rẻ một nửa!",
    analogy_en: "An infinitely scalable object warehouse with an automated janitor (Lifecycle Rules) that moves aging files to cheaper cold storage after 30 and 90 days.",
    role_vi: "Lưu trữ dữ liệu gốc ban đầu (`raw`), dữ liệu tạm (`temp` - tự xóa sau 7 ngày) và file trạng thái của Terraform (`tfstate`).",
    role_en: "Stores raw batch files (`raw`), temporary job staging files (`temp` - auto-deleted after 7 days), and versioned Terraform state.",
    pde_vi: [
      "4 tầng lưu trữ: Standard (truy cập thường xuyên) -> Nearline (>30 ngày) -> Coldline (>90 ngày) -> Archive (>365 ngày).",
      "Luôn bật Uniform bucket-level access để quản lý quyền đồng nhất bằng IAM."
    ],
    pde_en: [
      "Storage Classes: Standard -> Nearline (30d) -> Coldline (90d) -> Archive (365d).",
      "Uniform bucket-level access + Customer-Managed Encryption Keys (CMEK)."
    ],
    code: "infra/modules/storage_lakehouse/main.tf",
    ui_vi: "Ô tìm kiếm GCP -> Gõ 'Cloud Storage' -> Buckets -> Xem tab 'Lifecycle'.",
    ui_en: "GCP Console Search -> 'Cloud Storage' -> Buckets -> Inspect the 'Lifecycle' tab."
  },
  dataflow: {
    icon: "🌊",
    title: "Cloud Dataflow (Apache Beam)",
    tier_vi: "TẮT MẶC ĐỊNH — Bật khi học (~$0.07/giờ, test trên máy $0)",
    tier_en: "OFF BY DEFAULT — Enable for Lab (~$0.07/hr, Local runner is $0)",
    analogy_vi: "Nhà máy chế biến thông minh chạy 24/7: Nhận từng giọt dữ liệu từ Pub/Sub, kiểm tra chất lượng, gom nhóm doanh thu theo mỗi phút (Windowing), và chờ cả những đơn hàng bị nghẽn mạng gửi đến muộn (Watermarks).",
    analogy_en: "A smart, autoscaling processing plant that validates streaming events in real time, groups metrics into 1-minute windows, and handles late-arriving data gracefully.",
    role_vi: "Đọc dữ liệu từ Pub/Sub, tách bản ghi lỗi sang DLQ, chuẩn hóa thời gian và ghi song song vào BigQuery và Bigtable.",
    role_en: "Executes Apache Beam pipelines for unified batch and streaming ETL with exactly-once processing guarantees.",
    pde_vi: [
      "3 khái niệm cốt lõi nhất kỳ thi PDE: Windowing (Fixed, Sliding, Session), Watermarks (mốc thời gian tiến trình), và Triggers (xử lý Late Data).",
      "Side Inputs: Cách ghép (join) luồng dữ liệu đang chảy với một bảng danh mục ít thay đổi."
    ],
    pde_en: [
      "Core PDE Topics: Windowing (Fixed, Sliding, Session), Watermarks, Allowed Lateness, and Triggers.",
      "Using Side Inputs to enrich streaming events with slowly changing lookup data."
    ],
    code: "pipelines/streaming_beam/main.py",
    ui_vi: "Ô tìm kiếm GCP -> Gõ 'Dataflow' -> Jobs (Xem biểu đồ DAG trực quan của từng bước).",
    ui_en: "GCP Console Search -> 'Dataflow' -> Jobs (Inspect the visual execution graph)."
  },
  dataproc: {
    icon: "⚡",
    title: "Dataproc Serverless (Apache Spark)",
    tier_vi: "CHẠY XONG TỰ TẮT (~$0.05 / lần chạy vài phút)",
    tier_en: "AUTO-TERMINATES ON COMPLETION (~$0.05 / batch run)",
    analogy_vi: "Thay vì phải mua và nuôi một đội xe tải 24/24 rất tốn kém, Dataproc Serverless giống như gọi Grab/Uber tải: Khi có lô hàng lớn trong kho Raw, nó gọi Spark lên chạy đúng 3 phút để nén thành file Parquet rồi tự biến mất (tốn vài xu!).",
    analogy_en: "Instead of paying 24/7 for an idle cluster of servers, Dataproc Serverless spins up Apache Spark on demand, processes your raw files into Parquet in minutes, and shuts down to $0.",
    role_vi: "Chạy job PySpark khử trùng lặp đơn hàng và chuyển đổi từ JSON/CSV thô sang định dạng cột Parquet phân vùng theo ngày (`order_date`).",
    role_en: "Runs PySpark batch deduplication and converts raw JSON/CSV files into Hive-partitioned Snappy Parquet on GCS.",
    pde_vi: [
      "Luôn lưu dữ liệu trên Cloud Storage (GCS) thay vì HDFS để tách biệt Compute và Storage — giúp xóa cluster ngay khi chạy xong mà không mất dữ liệu!",
      "Dùng Preemptible / Spot VMs cho Secondary Workers để giảm 60-80% chi phí."
    ],
    pde_en: [
      "Decouple Compute from Storage by replacing HDFS with Cloud Storage Connector (GCS).",
      "Use Spot/Preemptible VMs with Enhanced Flexibility Mode (EFM) for cost optimization."
    ],
    code: "pipelines/spark_jobs/orders_raw_to_curated.py",
    ui_vi: "Ô tìm kiếm GCP -> Gõ 'Dataproc' -> Chọn mục 'Batches' (Serverless).",
    ui_en: "GCP Console Search -> 'Dataproc' -> Select 'Batches' (Serverless)."
  },
  gcs_curated: {
    icon: "📚",
    title: "GCS Curated Bucket + BigLake External Table",
    tier_vi: "LUÔN BẬT — $0.00/tháng (Serverless Lakehouse)",
    tier_en: "ALWAYS ON — $0.00/month (Serverless Lakehouse)",
    analogy_vi: "BigLake là chiếc 'cầu nối thần kỳ': Dữ liệu vẫn nằm yên dưới dạng file Parquet giá rẻ trong kho GCS Curated, nhưng bạn lại có thể vào BigQuery gõ lệnh SQL tra cứu và phân quyền bảo mật y hệt như bảng род (native) của BigQuery!",
    analogy_en: "BigLake bridges Data Lakes and Data Warehouses: files stay as open Parquet in GCS, while BigQuery queries them in place with full row- and column-level security.",
    role_vi: "Lưu trữ dữ liệu sạch dạng Parquet (`curated`) và kết nối vào BigQuery thông qua `google_bigquery_connection`.",
    role_en: "Provides a governed Open Lakehouse layer over partitioned Parquet files in GCS.",
    pde_vi: [
      "Tại sao dùng BigLake thay vì External Table thường? Vì BigLake hỗ trợ phân quyền chi tiết đến từng cột (Column-level security) và từng dòng (Row-level security) ngay trên file GCS!",
      "Định dạng Parquet lưu theo cột (Columnar) giúp giảm 80-90% dung lượng quét."
    ],
    pde_en: [
      "BigLake External Tables vs Standard External Tables: BigLake enforces fine-grained access control and metadata caching on GCS Parquet/Iceberg files."
    ],
    code: "infra/modules/storage_lakehouse/main.tf",
    ui_vi: "BigQuery -> Trong Explorer, mở project -> Xem mục 'External connections'.",
    ui_en: "BigQuery -> Explorer pane -> Expand project -> 'External connections'."
  },
  bigquery: {
    icon: "🏛️",
    title: "BigQuery Data Warehouse + Dataform (SQLX)",
    tier_vi: "LUÔN BẬT — $0.00/tháng (Miễn phí 10GB lưu trữ + 1TB query/tháng)",
    tier_en: "ALWAYS ON — $0.00/month (10GB storage + 1TB query/month free)",
    analogy_vi: "BigQuery là siêu thư viện không cần quản trị máy chủ. Nhờ chia ngăn theo Ngày (Partitioning) và xếp theo Mã khách hàng (Clustering), khi bạn tìm đơn hàng hôm nay, nó chỉ mở đúng ngăn hôm nay thay vì lục tung cả thư viện — vừa nhanh vừa không tốn tiền!",
    analogy_en: "A serverless petabyte-scale data warehouse. Partitioning by date and Clustering by user_id means queries only scan today's drawer instead of the entire building.",
    role_vi: "Lưu trữ 4 tầng dữ liệu (`raw`, `staging`, `marts`, `ml`) và dùng Dataform (SQLX) để biến đổi kèm kiểm tra chất lượng tự động (Assertions).",
    role_en: "Hosts the `raw`, `staging`, `marts`, and `ml` datasets with Dataform SQLX pipelines and automated data quality assertions.",
    pde_vi: [
      "Bật `require_partition_filter = true` để ép mọi câu lệnh SQL phải có `WHERE event_timestamp >= ...`, tránh quét nhầm toàn bộ bảng.",
      "Dataform miễn phí 100% trên GCP, thay thế hoàn hảo cho dbt để quản lý luồng ELT bằng Git."
    ],
    pde_en: [
      "Combine Time-Unit Partitioning (`event_timestamp`) with Clustering (`event_type`, `user_id`) and `require_partition_filter = true`.",
      "Use Dataform Assertions (`uniqueKey`, `nonNull`) to enforce data quality gates."
    ],
    code: "infra/modules/bigquery_dwh/main.tf & pipelines/dataform/",
    ui_vi: "Ô tìm kiếm GCP -> Gõ 'BigQuery' -> Mở SQL Workspace và tab 'Dataform'.",
    ui_en: "GCP Console Search -> 'BigQuery' -> SQL Workspace & 'Dataform'."
  },
  bigtable: {
    icon: "🚀",
    title: "Cloud Bigtable (Low-Latency NoSQL Serving)",
    tier_vi: "TẮT MẶC ĐỊNH — Chỉ bật khi làm Lab (~$0.65/giờ cho 1 node)",
    tier_en: "OFF BY DEFAULT — Enable only during Lab (~$0.65/hr for 1 node)",
    analogy_vi: "Nếu BigQuery là nhà kho phân tích báo cáo lớn (mất 1-2 giây), thì Bigtable là tủ đồ phản xạ tức thời dưới 5 mili-giây (5ms) dùng để hiển thị ngay lịch sử hoạt động vừa xong của khách hàng trên màn hình App.",
    analogy_en: "While BigQuery excels at complex analytical scans (seconds), Bigtable is a key-value speed demon delivering single-digit millisecond reads/writes for live user apps.",
    role_vi: "Lưu trữ lịch sử hoạt động thời gian thực của từng khách hàng với thiết kế khóa chính (Row Key) chống nghẽn cổ chai (Anti-Hotspotting).",
    role_en: "Serves real-time user activity metrics using a salted, reverse-timestamp row key (`SALT#user_id#reverse_epoch_ms`).",
    pde_vi: [
      "Cực kỳ hay thi trong PDE: Thiết kế Row Key cho Bigtable! KHÔNG BAO GIỜ đặt `timestamp` ở đầu Row Key vì mọi bản ghi mới sẽ dồn vào 1 máy chủ duy nhất (Hotspotting).",
      "Giải pháp: Đưa `salt#user_id` lên đầu và dùng `reverse_timestamp` ở cuối để lấy N bản ghi mới nhất nhanh nhất."
    ],
    pde_en: [
      "Top PDE Exam Question: Avoid Bigtable Hotspotting by never starting row keys with a monotonic timestamp.",
      "Use Salting + Field Promotion (`<salt>#<user_id>#<reverse_timestamp>`) and Garbage Collection policies."
    ],
    code: "pipelines/streaming_beam/main.py (compute_bigtable_row_key)",
    ui_vi: "Ô tìm kiếm GCP -> Gõ 'Bigtable' -> Instances (Nhớ chạy `make lab-off` ngay sau khi xem xong!).",
    ui_en: "GCP Console Search -> 'Bigtable' -> Instances (Run `make lab-off` right after testing!)."
  },
  governance: {
    icon: "🔐",
    title: "IAM, Cloud KMS (CMEK) & Policy Tags (Column Security)",
    tier_vi: "LUÔN BẬT — $0.00/tháng (Chi phí KMS chỉ vài xu)",
    tier_en: "ALWAYS ON — ~$0.00/month",
    analogy_vi: "Giống như hệ thống thẻ từ trong tòa nhà ngân hàng: Nhân viên giao nhận chỉ vào được sảnh Raw; nhân viên phân tích xem được bảng doanh thu nhưng cột Email/SĐT khách hàng sẽ tự động bị làm mờ (Policy Tag) nếu không có quyền đặc biệt!",
    analogy_en: "Like a smart security badge system: ingestion workers can only drop packages in the lobby, and analysts can query customer tables while sensitive PII columns (Email) are automatically masked.",
    role_vi: "Tách 3 Service Account riêng biệt (`ingest`, `process`, `orchestrate`), mã hóa bằng khóa KMS tự động xoay vòng 90 ngày, và gắn Policy Tag `PII_HIGH` lên cột `customer_email`.",
    role_en: "Enforces Principle of Least Privilege, 90-day CMEK key rotation, Keyless GitHub WIF, and BigQuery Column-Level Security via Policy Tags.",
    pde_vi: [
      "Không bao giờ dùng khóa JSON tĩnh (`Service Account Key`) -> Dùng Workload Identity Federation (WIF).",
      "Phân biệt: Authorized Views vs Row-Level Security vs Policy Tags (Column-Level Security & Dynamic Data Masking)."
    ],
    pde_en: [
      "Replace downloadable Service Account JSON keys with Workload Identity Federation (WIF).",
      "Know when to use Policy Tags (Column-level security), Row-level access policies, and Cloud KMS (CMEK)."
    ],
    code: "infra/modules/iam_security/main.tf & infra/modules/bigquery_dwh/main.tf",
    ui_vi: "GCP Console -> IAM & Admin -> Service Accounts; Security -> Key Management; BigQuery -> Policy tags.",
    ui_en: "GCP Console -> IAM & Admin -> Service Accounts; Security -> Key Management; Dataplex -> Policy tags."
  },
  bqml: {
    icon: "🧠",
    title: "BigQuery ML (In-Warehouse Machine Learning)",
    tier_vi: "LUÔN BẬT — Nằm trong Free Tier của BigQuery",
    tier_en: "ALWAYS ON — Included in BigQuery Free Tier",
    analogy_vi: "Thông thường muốn làm AI bạn phải bê dữ liệu ra ngoài và viết hàng trăm dòng code Python. Với BigQuery ML, bạn chỉ cần viết đúng 10 dòng lệnh SQL quen thuộc ngay trong kho dữ liệu để dạy máy dự đoán khách hàng nào sắp bỏ đi!",
    analogy_en: "Instead of exporting data to external servers to train AI models, BigQuery ML lets you train churn classification and revenue forecasting models using standard SQL right where the data lives.",
    role_vi: "Huấn luyện 2 mô hình: Dự đoán khách hàng rời bỏ (`LOGISTIC_REG` kèm `TRANSFORM`) và Dự báo doanh thu 14 ngày tới (`ARIMA_PLUS`).",
    role_en: "Trains `LOGISTIC_REG` (with `TRANSFORM` feature scaling) and `ARIMA_PLUS` time-series forecasting models directly in SQL.",
    pde_vi: [
      "Dùng mệnh đề `TRANSFORM()` trong BQML để tự động chuẩn hóa dữ liệu (`ML.STANDARD_SCALER`, `ML.ONE_HOT_ENCODER`) lúc dự đoán (Serving) giống hệt lúc huấn luyện.",
      "Dùng `ML.EXPLAIN_PREDICT` để giải thích yếu tố nào ảnh hưởng nhất đến kết quả dự đoán."
    ],
    pde_en: [
      "Prevent training-serving skew by embedding preprocessing (`ML.STANDARD_SCALER`, `ML.ONE_HOT_ENCODER`) inside the `TRANSFORM()` clause.",
      "Use `ML.EVALUATE` and `ML.EXPLAIN_PREDICT` for model evaluation and explainability."
    ],
    code: "pipelines/bqml/churn_logistic_reg.sql & revenue_forecast_arima.sql",
    ui_vi: "BigQuery -> Mở dataset `ml` -> Click vào tên Model để xem biểu đồ độ chính xác (Evaluation).",
    ui_en: "BigQuery -> Dataset `ml` -> Click the trained model to view visual Evaluation metrics."
  },
  orchestration: {
    icon: "🎼",
    title: "Cloud Workflows (Free) vs Cloud Composer (Airflow)",
    tier_vi: "LUÔN BẬT Cloud Workflows ($0) / Tắt Composer mặc định ($0.45/h)",
    tier_en: "ALWAYS ON Cloud Workflows ($0) / Composer OFF by default ($0.45/hr)",
    analogy_vi: "Là người Nhạc trưởng cầm đũa chỉ huy: Đúng 2 giờ sáng mỗi ngày, Nhạc trưởng tự động đánh thức BigQuery tổng hợp doanh thu, kiểm tra xem có lỗi không, nếu thành công thì báo cáo hoàn tất.",
    analogy_en: "The conductor of the orchestra: triggers each pipeline step in sequence on a schedule, handles retries on failure, and logs every execution.",
    role_vi: "Hàng ngày dùng Cloud Workflows + Cloud Scheduler (miễn phí 5.000 bước/tháng). Khi ôn thi tuần 6 thì bật Cloud Composer 2 tiếng để thực hành Airflow DAG.",
    role_en: "Uses serverless Cloud Workflows for daily $0 orchestration, plus an optional Cloud Composer (Airflow) environment for Week 6 hands-on practice.",
    pde_vi: [
      "Mẹo tiết kiệm $300: Cloud Composer tốn ~$300/tháng nếu bật liên tục. Dùng Cloud Workflows cho điều phối API nhẹ nhàng (miễn phí) và chỉ dùng Composer khi cần hệ sinh thái Python/Airflow phức tạp."
    ],
    pde_en: [
      "Choose Cloud Workflows for lightweight serverless API orchestration, and Cloud Composer when complex Python/Airflow operators or hybrid cloud DAGs are required."
    ],
    code: "infra/modules/orchestration/main.tf & pipelines/orchestration/",
    ui_vi: "Ô tìm kiếm GCP -> Gõ 'Workflows' -> Click `pde-dev-daily-lakehouse-wf` để xem sơ đồ khối.",
    ui_en: "GCP Console Search -> 'Workflows' -> Click `pde-dev-daily-lakehouse-wf` to view the visual state graph."
  }
};
