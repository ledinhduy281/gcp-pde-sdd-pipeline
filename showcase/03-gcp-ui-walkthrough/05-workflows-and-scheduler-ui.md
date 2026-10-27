# Bước 5: Xem Nhạc Trưởng Điều Phối Tự Động (Cloud Workflows & Cloud Scheduler) Trên GCP UI

Thay vì phải bật Cloud Composer tốn $0.45/giờ suốt cả tháng, dự án sử dụng **Cloud Workflows** hoàn toàn miễn phí ($0.00) để điều phối hàng ngày (`infra/modules/orchestration`).

---

## 1. Xem Sơ Đồ Khối Và Bấm Chạy Thử Cloud Workflow Trên Giao Diện Web

1. Trên thanh tìm kiếm GCP Console, gõ **`Workflows`** -> Chọn **Workflows**.
2. Bạn sẽ thấy workflow tên là **`pde-dev-daily-lakehouse-wf`**. Click vào tên đó.
3. Chuyển sang tab **`SOURCE`** (hoặc **`DEFINITION`**):
   - Bên trái là đoạn mã kịch bản YAML gọi trực tiếp vào BigQuery để tổng hợp doanh thu 7 ngày gần nhất vào bảng `marts.fact_daily_revenue`.
   - Bên phải là **Biểu đồ luồng trực quan (Visual Graph)** vẽ các bước `refresh_fact_daily_revenue` -> `return_summary`.
4. **Chạy thử ngay trên giao diện (Tốn $0.00!)**:
   - Bấm nút **`EXECUTE`** ở phía trên cùng -> Bấm tiếp nút **`EXECUTE`** màu xanh ở trang tiếp theo.
   - Sau khoảng 2–3 giây, trạng thái sẽ báo **`Succeeded`** màu xanh lá cây! Bạn vừa kích hoạt thành công 1 chu trình tổng hợp dữ liệu tự động.

---

## 2. Xem Đồng Hồ Hẹn Giờ Tự Động (Cloud Scheduler)

1. Trên thanh tìm kiếm GCP Console, gõ **`Cloud Scheduler`** -> Chọn **Cloud Scheduler**.
2. Bạn sẽ thấy công việc hẹn giờ tên là **`pde-dev-daily-wf-trigger`**:
   - **Frequency**: `0 2 * * *` (Chạy lúc 2:00 sáng mỗi ngày).
   - **State**: `Paused` (Mình đã để mặc định là Tạm dừng để bạn chủ động bấm nút **`RESUME`** hoặc **`FORCE RUN`** bất cứ lúc nào bạn muốn).
