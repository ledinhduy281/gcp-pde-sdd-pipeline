# Bước 4: Khám Phá Trung Tâm Phân Tích BigQuery, Policy Tags & BigQuery ML Trên GCP UI

**BigQuery** là trái tim của toàn bộ dự án (`infra/modules/bigquery_dwh`). Đây là nơi bạn sẽ dành nhiều thời gian thực hành nhất.

---

## 1. Mở Không Gian Làm Việc BigQuery (SQL Workspace)

1. Trên thanh tìm kiếm GCP Console, gõ **`BigQuery`** -> Chọn **BigQuery**.
2. Nhìn vào cột **Explorer** bên tay trái, tìm tên Project của bạn và bấm vào mũi tên `▶` để mở rộng ra.
3. Bạn sẽ thấy **4 Datasets** (4 tầng dữ liệu) và **External connections**:
   - 📁 **`raw`**: Chứa bảng `events_stream` (dữ liệu chuẩn) và `malformed_events` (khay chứa dữ liệu lỗi DLQ).
   - 📁 **`staging`**: Tầng trung gian làm sạch dữ liệu.
   - 📁 **`marts`**: Chứa bảng `dim_customers` và `fact_daily_revenue` phục vụ báo cáo.
   - 📁 **`ml`**: Nơi chứa các mô hình AI/Machine Learning.
   - 🔗 **`External connections`**: Chứa cầu nối BigLake (`us-central1.pde-dev-biglake-conn`).

---

## 2. Xem Cấu Hình Chia Ngăn (Partitioning) & Gom Cụm (Clustering)

1. Trong cột Explorer bên trái, bấm mở rộng thư mục **`raw`** -> Click vào bảng **`events_stream`**.
2. Ở màn hình chính bên phải:
   - **Tab `SCHEMA`**: Xem danh sách 11 cột dữ liệu đúng chuẩn Data Contract.
   - **Tab `DETAILS`**: Cuộn xuống mục **Table info**, bạn sẽ thấy:
     - **Partitioned by**: `DAY` (on field `event_timestamp`) — Giúp chia bảng thành từng ngăn theo ngày.
     - **Partition filter**: `Required` (`true`) — Bắt buộc câu lệnh SQL phải có điều kiện lọc ngày để bảo vệ bạn không bao giờ quét nhầm toàn bộ bảng tốn dung lượng!
     - **Clustered by**: `event_type, user_id` — Sắp xếp dữ liệu trong từng ngày theo loại sự kiện và mã khách hàng.

---

## 3. Xem Nhãn Bảo Mật Cấp Cột (Policy Tags) Che Email Khách Hàng

1. Trong cột Explorer bên trái, bấm mở rộng thư mục **`marts`** -> Click vào bảng **`dim_customers`**.
2. Ở tab **`SCHEMA`**, hãy nhìn vào dòng cột **`customer_email`**:
   - Nhìn sang cột **Policy tags** bên phải của dòng đó: Bạn sẽ thấy một nhãn màu xanh gắn tên **`PII_HIGH_SENSITIVITY`** (thuộc bộ phân loại `pde-dev-pii-classification`)!
   - Nhờ nhãn này, bất kỳ ai không được cấp quyền đọc dữ liệu nhạy cảm khi gõ `SELECT * FROM marts.dim_customers` sẽ bị chặn không cho xem cột `customer_email`.
