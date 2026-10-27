# Bước 2: Xem Các Kho Chứa File (Cloud Storage Buckets & Lifecycle) Trên GCP UI

Dịch vụ **Cloud Storage (GCS)** là nền tảng lưu trữ file của Data Lakehouse (`infra/modules/storage_lakehouse`).

---

## 1. Mở Danh Sách Các Kho Chứa (Buckets)

1. Trên thanh tìm kiếm GCP Console, gõ **`Cloud Storage`** -> Chọn **Buckets (Cloud Storage)**.
2. Bạn sẽ nhìn thấy **4 Buckets** (Thùng chứa dữ liệu):
   - `<project-id>-tfstate`: Chứa file trạng thái `terraform.tfstate` (bộ nhớ của Terraform).
   - `<project-id>-pde-dev-raw`: Kho chứa dữ liệu thô ban đầu.
   - `<project-id>-pde-dev-curated`: Kho chứa dữ liệu sạch đã nén chuẩn Parquet.
   - `<project-id>-pde-dev-temp`: Kho chứa file nháp tạm thời.

---

## 2. Kiểm Tra Quy Tắc Tự Động Dọn Kho & Tiết Kiệm Tiền (Lifecycle Rules)

Một câu hỏi cực kỳ phổ biến khi đi thi PDE là làm sao giảm tiền lưu trữ tự động theo thời gian:

1. Tại danh sách Buckets, hãy click vào tên bucket **`<project-id>-pde-dev-raw`**.
2. Nhìn lên dãy các tab ngang phía trên (`OBJECTS`, `CONFIGURATION`, `PERMISSIONS`, `PROTECTION`, `LIFECYCLE`), hãy click vào tab **`LIFECYCLE`**.
3. Bạn sẽ thấy **2 quy tắc tự động (Rules)** mà Terraform đã cài đặt:
   - **Rule 1 (`Set storage class to NEARLINE`)**: Điều kiện `30+ days since object was updated` -> Tự động chuyển file cũ hơn 30 ngày sang kho mát giá rẻ.
   - **Rule 2 (`Set storage class to COLDLINE`)**: Điều kiện `90+ days since object was updated` -> Tự động chuyển file cũ hơn 90 ngày sang kho lạnh sâu.
4. Quay lại danh sách Buckets, click vào **`<project-id>-pde-dev-temp`** -> Chọn tab **`LIFECYCLE`**:
   - Bạn sẽ thấy quy tắc **`Delete object`** sau **`7+ days`** -> Tự động xóa sạch file rác tạm thời sau 7 ngày để bạn không bao giờ tốn tiền lưu file nháp!

---

## 3. Kiểm Tra Chế Độ Bảo Mật Của Bucket

1. Trong bucket bất kỳ, chuyển sang tab **`CONFIGURATION`** (hoặc **`PERMISSIONS`**).
2. Quan sát 2 dòng:
   - **Public access prevention**: Ghi **`Enforced`** (Chặn tuyệt đối việc vô tình mở công khai dữ liệu ra internet).
   - **Access control**: Ghi **`Uniform`** (Quản lý quyền đồng nhất qua IAM chuẩn doanh nghiệp).
