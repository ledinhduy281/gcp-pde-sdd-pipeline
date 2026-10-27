# Bước 1: Kiểm Tra Bảo Mật (Service Accounts, Cloud KMS & GitHub WIF) Trên GCP UI

Sau khi chạy `make apply-core`, Terraform đã tạo cho bạn hệ thống bảo mật chuẩn thi chứng chỉ PDE (`infra/modules/iam_security`). Hãy kiểm tra từng thành phần trên giao diện web như sau:

---

## 1. Xem 3 "Tài Khoản Robot" (Service Accounts)

Trong thực tế, các dịch vụ không dùng email cá nhân của bạn mà dùng **Service Account** với quyền tối thiểu (Least Privilege):

1. Trên thanh tìm kiếm GCP Console, gõ **`Service Accounts`** -> Chọn **Service Accounts (IAM & Admin)**.
2. Bạn sẽ thấy danh sách **3 Service Accounts** do Terraform tạo ra:
   - `pde-dev-sa-ingest@...`: Chỉ có quyền nhận dữ liệu thô.
   - `pde-dev-sa-process@...`: Dùng cho máy trạm xử lý Dataflow & Dataproc.
   - `pde-dev-sa-orchestrate@...`: Dùng cho nhạc trưởng Cloud Workflows.
3. **Kiểm tra tuyệt đối không có khóa tĩnh (Zero Static Keys)**:
   - Nhìn vào cột **Key ID** của cả 3 dòng: Bạn sẽ thấy ghi **`No keys`**. Đây là chuẩn an toàn tuyệt đối trong đề thi PDE (không tạo file JSON key).

---

## 2. Xem Ổ Khóa Mã Hóa Tự Động Đổi 90 Ngày (Cloud KMS / CMEK)

1. Trên thanh tìm kiếm GCP Console, gõ **`Key Management`** -> Chọn **Key Management (Security)**.
2. Bạn sẽ thấy **Key Ring** tên là **`pde-dev-keyring`** tại vùng `us-central1` (hoặc vùng bạn chọn).
3. Click vào tên `pde-dev-keyring`:
   - Bạn sẽ thấy chìa khóa **`pde-dev-cmek-key`**.
   - Nhìn sang cột **Rotation period**: Bạn sẽ thấy ghi **`90 days`** (tự động xoay vòng khóa mỗi 90 ngày theo đúng `specs/03-infra-core.spec.md`).

---

## 3. Xem Cầu Nối Xác Thực Với GitHub (Workload Identity Federation)

1. Trên thanh tìm kiếm GCP Console, gõ **`Workload Identity Federation`** -> Chọn **Workload Identity Federation (IAM & Admin)**.
2. Bạn sẽ thấy Pool tên là **`GitHub Actions WIF Pool` (`pde-dev-gh-pool`)**.
3. Click vào tên Pool đó -> Nhìn sang góc phải dưới mục **Providers**, bạn sẽ thấy **`GitHub OIDC Provider` (`pde-dev-gh-oidc`)** chỉ tin cậy duy nhất repository `ledinhduy281/gcp-pde-sdd-pipeline`.
