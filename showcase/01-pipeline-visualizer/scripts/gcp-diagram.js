(function () {
  const NODE_DETAILS = {
    simulator: {
      title: "Excelerate-Jinder Event Producer (Talent & Job Engagement Stream)",
      desc: "Đọc dữ liệu thật từ `talents.json` (Sage Swift, Plum Wombat...) & `jobs.json` của Jinder, tính điểm F-01 SMF, F-02 GSI, F-05 FRS, F-06 TSS và bắn sự kiện JOB_VIEW, JOB_SAVE, JOB_APPLY vào Pub/Sub.",
      meta: "Code: pipelines/simulator/generate_events.py | Local App: make run-jinder-local"
    },
    pubsub: {
      title: "Cloud Pub/Sub (pde-dev-events-topic & pde-dev-events-beam-sub)",
      desc: "Cổng tiếp nhận sự kiện tương tác thời gian thực từ ứng dụng Jinder. Giữ tin nhắn 24h, ack_deadline = 60s, tự động đẩy sang Dead-Letter Topic nếu lỗi quá 5 lần.",
      meta: "Terraform: infra/modules/pubsub_messaging/main.tf | Cost: $0.00 (Free Tier)"
    },
    dlq: {
      title: "Dead-Letter Queue (DLQ Topic & BigQuery raw.malformed_events)",
      desc: "Khay cách ly dữ liệu lỗi của Jinder: Tự động bắt các bản ghi JSON hỏng, mức lương âm (order_amount < 0) hoặc tin tuyển dụng bị báo cáo sai phạm (>= 3 reports).",
      meta: "Contract: specs/02-data-contracts.spec.md | Cost: $0.00"
    },
    dataflow: {
      title: "Cloud Dataflow (Apache Beam — Jinder Behavioral FRS* Loop)",
      desc: "Tính toán vòng lặp phản hồi hành vi trực tiếp: FRS*(J|C) = min(100, FRS * (1 + delta_save - delta_ignore)), xử lý Late Data và tách nhánh lỗi bằng TaggedOutput('dlq').",
      meta: "Code: pipelines/streaming_beam/main.py | Flag: enable_streaming_dataflow"
    },
    gcs_raw: {
      title: "Cloud Storage Raw Bucket (Chứa Bộ Dataset Thật Của Jinder)",
      desc: "Lưu trữ `australian_jobs_dataset.csv`, `international_candidates_dataset.csv`, `real_resumes_dataset.csv`, `talents.json`, `jobs.json` và `ict_taxonomy.json`. Tự động chuyển sang Nearline sau 30 ngày.",
      meta: "Terraform: infra/modules/storage_lakehouse/main.tf | Dataset Size: ~3.5 MB ($0.00)"
    },
    cloudsql: {
      title: "Cloud SQL PostgreSQL + Datastream CDC (Đồng Bộ DB Của Jinder)",
      desc: "Mô phỏng việc nâng cấp cơ sở dữ liệu SQLite của `jinder_platform` lên Cloud SQL Postgres và đồng bộ thay đổi (CDC) thời gian thực sang kho phân tích.",
      meta: "Flag: enable_cloudsql_cdc = false (Default $0/hr, ~$0.03/hr when ON)"
    },
    dataproc: {
      title: "Dataproc Serverless (PySpark — Chuẩn Hóa Lương & Mã Nghề ANZSCO)",
      desc: "Chạy job PySpark khử trùng lặp, quy đổi lương năm theo quy tắc Jinder (hour*1950, day*220) và nén thành chuẩn cột Snappy Parquet rồi tự động tắt.",
      meta: "Code: pipelines/spark_jobs/orders_raw_to_curated.py | Serverless Batch"
    },
    gcs_curated: {
      title: "GCS Curated Bucket + BigLake External Connection",
      desc: "Lưu file Parquet đã chuẩn hóa của Jinder và kết nối vào BigQuery qua BigLake để áp dụng phân quyền bảo mật cấp cột/dòng.",
      meta: "Terraform: google_bigquery_connection.biglake | Cost: $0.00"
    },
    bigquery: {
      title: "BigQuery Data Warehouse (raw.events_stream)",
      desc: "Lưu toàn bộ sự kiện tương tác của ứng viên Jinder kèm 4 điểm số toán học (`frs_score`, `smf_score`, `gsi_score`, `tss_score`), chia ngăn theo ngày (Partition by DAY).",
      meta: "Terraform: infra/modules/bigquery_dwh/main.tf | Free Tier: 10GB + 1TB query/mo"
    },
    governance: {
      title: "Jinder Zero-PII Governance (REQ-A07) — Policy Tags & Star Schema Marts",
      desc: "Bảng `marts.dim_customers` hiển thị công khai `alias` cho nhà tuyển dụng nhưng gắn Policy Tag `PII_HIGH_SENSITIVITY` khóa chặt cột nhạy cảm `customer_email`, kết hợp bảng `marts.dim_jobs`.",
      meta: "Terraform: google_data_catalog_policy_tag.pii_high | CMEK 90-day rotation"
    },
    bqml: {
      title: "BigQuery ML (`ml.jinder_shortlist_logreg`) & Cloud Workflows",
      desc: "Huấn luyện mô hình AI dự đoán xác suất ứng viên vào vòng Shortlist từ 4 chỉ số toán học F-01 SMF, F-02 GSI, F-05 FRS, F-06 TSS và dự báo nhu cầu tuyển dụng 14 ngày tới.",
      meta: "Code: pipelines/bqml/churn_logistic_reg.sql | Cost: $0.00"
    },
    bigtable: {
      title: "Cloud Bigtable (Phục Vụ Bảng Feed Jinder Dưới 10ms - Tắt Mặc Định)",
      desc: "Trả kết quả danh sách việc làm cá nhân hóa (FRS*) cho từng ứng viên dưới 10ms với khóa Row Key chống nghẽn cổ chai: SALT(4)#seeker_id#reverse_epoch_ms.",
      meta: "Flag: enable_bigtable_serving = false (Default $0/hr, ~$0.65/hr when ON)"
    }
  };

  let isFlowing = true;

  function setFlowAnimation(enabled) {
    isFlowing = enabled;
    const paths = document.querySelectorAll("#gcp-arch-svg path[marker-end]");
    paths.forEach((p) => {
      p.classList.toggle("flowing-line", enabled);
    });
    const btn = document.getElementById("btn-toggle-flow");
    if (btn) {
      btn.textContent = enabled ? "⏸ Dừng Chuyển Động Dòng Chảy" : "▶ Chạy Chuyển Động Dòng Chảy";
    }
  }

  document.querySelectorAll(".diagram-node").forEach((node) => {
    node.addEventListener("click", () => {
      const key = node.dataset.node;
      const info = NODE_DETAILS[key];
      if (!info) return;
      document.getElementById("strip-title").textContent = info.title;
      document.getElementById("strip-desc").textContent = info.desc;
      document.getElementById("strip-meta").textContent = info.meta;
    });
  });

  const btnFlow = document.getElementById("btn-toggle-flow");
  if (btnFlow) {
    btnFlow.addEventListener("click", () => setFlowAnimation(!isFlowing));
  }

  const btnDownload = document.getElementById("btn-download-svg");
  if (btnDownload) {
    btnDownload.addEventListener("click", () => {
      const svgEl = document.getElementById("gcp-arch-svg");
      const serializer = new XMLSerializer();
      const source = serializer.serializeToString(svgEl);
      const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "excelerate-jinder-gcp-architecture.svg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  setFlowAnimation(true);
})();
