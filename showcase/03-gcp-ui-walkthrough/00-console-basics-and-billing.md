# Bước 0: Làm Quen Giao Diện GCP Console & Kiểm Tra Gói $300 Free Trial

Tài liệu này dành cho người **chưa từng dùng Google Cloud Console** để bạn biết chính xác cần bấm vào đâu trên trình duyệt sau khi chạy lệnh `make apply-core`.

---

## 1. Mở Google Cloud Console & Chọn Đúng Project

1. Mở trình duyệt và truy cập: **[https://console.cloud.google.com](https://console.cloud.google.com)**
2. Nhìn lên **Thanh trên cùng (Top Bar)**, ngay bên cạnh logo **Google Cloud**, bạn sẽ thấy một ô chọn Project (Project Picker).
3. Click vào ô đó -> Một cửa sổ hiện ra -> Chọn tab **ALL** và click vào Project của bạn (ví dụ: `gcp-pde-pipeline-...`).
   > **Lưu ý quan trọng**: Nếu bạn chọn nhầm Project khác trên thanh này, bạn sẽ thấy màn hình trống trơn và tưởng là Terraform chưa tạo gì!

---

## 2. Cách Dùng "Thanh Tìm Kiếm Thần Thánh" (Search Bar)

Trên GCP có hơn 200 dịch vụ, vì vậy **đừng cố tìm trong menu dọc bên trái**. Cách nhanh nhất mà mọi kỹ sư GCP đều dùng là:
- Nhìn vào **Ô tìm kiếm ở chính giữa phía trên cùng** (hoặc bấm phím `/`).
- Gõ tên dịch vụ bằng tiếng Anh (ví dụ: `BigQuery`, `Buckets`, `Pub/Sub`, `Workflows`, `Billing`) rồi nhấn **Enter**.

---

## 3. Kiểm Tra Số Dư $300 Free Trial & Cài Đặt Cảnh Báo Ngân Sách (Làm Ngay!)

1. Trên thanh tìm kiếm, gõ **`Billing`** -> Chọn **Billing**.
2. Ở menu bên trái của trang Billing, chọn **Credits** (hoặc nhìn vào góc phải mục **Promotional credits**):
   - Bạn sẽ thấy dòng **Free Trial Credit** cùng số tiền còn lại (ví dụ: `$300.00 remaining`) và số ngày còn hiệu lực.
3. **Tạo Cảnh Báo Ngân Sách (Budgets & alerts)**:
   - Ở menu bên trái, click vào **Budgets & alerts** -> Bấm nút **+ CREATE BUDGET** ở phía trên.
   - **Name**: Nhập `PDE-Study-Budget-Alert`. Bấm **Next**.
   - **Amount**: Chọn **Specified amount**, nhập `50` ($50).
   - Bỏ dấu tích ở ô *"Include promotions and credits in cost"* (hoặc giữ nguyên tùy giao diện để theo dõi cả tiền credit bị trừ). Bấm **Next**.
   - **Actions**: Mặc định GCP sẽ gửi email cho bạn khi chạm mốc `50%`, `90%`, `100%` của $50. Bấm **Finish**.
