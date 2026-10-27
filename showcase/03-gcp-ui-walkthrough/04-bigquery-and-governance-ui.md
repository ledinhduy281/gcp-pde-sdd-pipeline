# Bước 4: Khám Phá Mô Hình Star Schema Của Jinder, Zero-PII Policy Tags & BigQuery ML Trên GCP UI

**BigQuery** là nơi lưu trữ toàn bộ mô hình dữ liệu Star Schema của **Excelerate-Jinder** (`infra/modules/bigquery_dwh/main.tf`).

---

## 1. Mở Không Gian Làm Việc BigQuery (SQL Workspace)

1. Trên thanh tìm kiếm GCP Console, gõ **`BigQuery`** -> Chọn **BigQuery**.
2. Nhìn vào cột **Explorer** bên tay trái, tìm tên Project của bạn và bấm vào mũi tên `▶` để mở rộng ra.
3. Bạn sẽ thấy **4 Datasets** (4 tầng dữ liệu của Jinder) và **External connections**:
   - 📁 **`raw`**:
     - `events_stream`: Lưu luồng sự kiện tương tác của ứng viên Jinder (`JOB_VIEW`, `JOB_SAVE`, `JOB_IGNORE`, `JOB_APPLY`) kèm mã nghề Úc `anzsco_code` và 4 điểm số toán học `frs_score` (F-05), `smf_score` (F-01), `gsi_score` (F-02), `tss_score` (F-06).
     - `malformed_events`: Khay cách ly (DLQ) chứa các bản ghi lỗi hoặc tin tuyển dụng bị báo cáo sai phạm.
   - 📁 **`staging`**: Tầng trung gian làm sạch dữ liệu (`stg_events`).
   - 📁 **`marts`** (Mô hình Star Schema của Jinder):
     - `dim_customers`: Bảng hồ sơ ứng viên Jinder (chứa `alias` công khai như `Sage Swift`, `Plum Wombat` và cột `customer_email` được khóa bảo mật Zero-PII).
     - `dim_jobs`: Bảng danh mục việc làm Úc & ICT phân cụm theo `category` và `anzsco_code`, với mức lương đã quy đổi ra lương năm (`annual_salary_min`, `annual_salary_max`).
     - `fact_daily_revenue`: Bảng tổng hợp số lượng đơn ứng tuyển và điểm trung bình `avg_frs_score` theo ngày.
   - 📁 **`ml`**: Nơi chứa mô hình AI dự đoán trúng tuyển `jinder_shortlist_logreg` và dự báo nhu cầu `daily_revenue_forecast`.
   - 🔗 **`External connections`**: Chứa cầu nối BigLake (`us-central1.pde-dev-biglake-conn`).

---

## 2. Xem Cấu Hình Chia Ngăn (Partitioning) & Gom Cụm (Clustering)

1. Trong cột Explorer bên trái, bấm mở rộng thư mục **`raw`** -> Click vào bảng **`events_stream`**.
2. Ở màn hình chính bên phải:
   - **Tab `SCHEMA`**: Xem danh sách 17 cột dữ liệu của Jinder (bao gồm `job_id`, `anzsco_code`, `frs_score`, `smf_score`, `gsi_score`, `tss_score`).
   - **Tab `DETAILS`**: Cuộn xuống mục **Table info**, bạn sẽ thấy:
     - **Partitioned by**: `DAY` (on field `event_timestamp`).
     - **Partition filter**: `Required` (`true`) — Bảo vệ bạn không bao giờ quét nhầm toàn bộ bảng!
     - **Clustered by**: `event_type, user_id`.

---

## 3. Xem Nhãn Bảo Mật Cấp Cột Chuẩn Zero-PII Của Jinder (`REQ-A07`)

1. Trong cột Explorer bên trái, bấm mở rộng thư mục **`marts`** -> Click vào bảng **`dim_customers`**.
2. Ở tab **`SCHEMA`**, hãy quan sát sự khác biệt giữa 2 cột:
   - Dòng **`alias`**: Không gắn thẻ khóa -> Nhà tuyển dụng (HR) truy vấn thoải mái để xem bí danh ứng viên (`Plum Wombat`, `Cyan Puffin`).
   - Dòng **`customer_email`**: Nhìn sang cột **Policy tags** bên phải, bạn sẽ thấy nhãn màu xanh **`PII_HIGH_SENSITIVITY`** (thuộc bộ phân loại `pde-dev-jinder-zero-pii`)!
   - Nhờ nhãn này, quy tắc **Zero-PII (`REQ-A07`)** của Jinder được thực thi tự động ngay ở tầng cơ sở dữ liệu đám mây!
