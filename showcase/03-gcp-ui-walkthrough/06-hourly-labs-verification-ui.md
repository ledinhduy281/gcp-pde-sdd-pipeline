# Bước 6: Cách Kiểm Tra Các Dịch Vụ Tính Phí Theo Giờ Đã Tắt Sạch 100% ($0/giờ) Trên GCP UI

Để bạn hoàn toàn yên tâm rằng gói **$300 Free Trial** không bị trừ tiền ngầm khi bạn nghỉ ngơi, đây là cách kiểm tra nhanh các dịch vụ tính phí theo giờ trên GCP Console sau khi bạn chạy lệnh `make lab-off`:

---

## Danh Sách Kiểm Tra Nhanh 30 Giây (Checklist An Toàn Chi Phí)

| Dịch Vụ Tính Giờ | Cách Tìm Trên GCP Console | Trạng Thái An Toàn Tuyệt Đối ($0/giờ) |
| :--- | :--- | :--- |
| **1. Cloud Bigtable** | Gõ **`Bigtable`** trên thanh tìm kiếm | Màn hình hiện *"You don't have any Bigtable instances"* (0 instances). |
| **2. Cloud SQL** | Gõ **`SQL`** trên thanh tìm kiếm | Màn hình hiện *"Create a database instance"* (0 instances). |
| **3. Cloud Composer** | Gõ **`Composer`** trên thanh tìm kiếm | Danh sách Environments trống trơn (0 environments). |
| **4. Cloud Dataflow** | Gõ **`Dataflow`** -> **Jobs** | Không có job nào ở trạng thái **`Running`** (chỉ có `Cancelled`, `Drained` hoặc `Succeeded`). |
| **5. Cloud Dataproc** | Gõ **`Dataproc`** -> **Clusters** | Danh sách Clusters trống trơn (0 clusters). |

---

## Quy Trình Chuẩn Khi Bạn Muốn Bật Thực Hành 1 Bài Lab Tính Giờ

Ví dụ ở **Tuần 4**, khi bạn muốn nhìn tận mắt **Cloud Bigtable** trên giao diện GCP UI:
1. Mở Terminal tại `/Users/dinhduy/GCP`, chạy:
   ```bash
   make lab-bigtable-on
   ```
2. Đợi khoảng 60 giây cho Terraform tạo xong -> Mở GCP Console -> Gõ **`Bigtable`** -> Bạn sẽ thấy instance **`pde-dev-bt-instance`** và bảng **`user_activity_serving`**.
3. Sau khi khám phá và thực hành xong (khoảng 30–60 phút, chỉ tốn ~$0.35), quay lại Terminal gõ ngay:
   ```bash
   make lab-off
   ```
4. Refresh lại trang Bigtable trên GCP Console -> Instance đã được xóa sạch sẽ, chi phí quay về **$0.00/giờ**!
