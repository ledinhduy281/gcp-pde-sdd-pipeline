# Bước 3: Xem Cổng Tiếp Nhận Dữ Liệu Thời Gian Thực (Cloud Pub/Sub & DLQ) Trên GCP UI

Dịch vụ **Cloud Pub/Sub** là băng chuyền nhận dữ liệu thời gian thực (`infra/modules/pubsub_messaging`). Bạn có thể bắn thử 1 tin nhắn ngay trên giao diện web!

---

## 1. Xem Các Đường Ống Tin Nhắn (Topics)

1. Trên thanh tìm kiếm GCP Console, gõ **`Pub/Sub`** -> Chọn **Topics (Pub/Sub)**.
2. Bạn sẽ thấy **2 Topics**:
   - **`pde-dev-events-topic`**: Kênh chính nhận mọi đơn hàng và thao tác click.
   - **`pde-dev-events-dlq-topic`**: Kênh cách ly (Dead-Letter Queue) chuyên hứng các tin nhắn bị lỗi không xử lý được.

---

## 2. Xem Cấu Hình Khay Hứng Hàng Lỗi (Dead-Letter Policy)

1. Ở menu bên trái của trang Pub/Sub, click vào mục **`Subscriptions`**.
2. Click vào tên **`pde-dev-events-beam-sub`**.
3. Mở tab **`DETAILS`** ở phía dưới:
   - Bạn sẽ thấy mục **Dead lettering**:
     - **Dead letter topic**: Trỏ thẳng về `pde-dev-events-dlq-topic`.
     - **Maximum delivery attempts**: `5` (Nếu gửi thử 5 lần mà consumer không xử lý được thì tự động đẩy sang kênh lỗi DLQ).

---

## 3. Thực Hành Thử Nghiệm: Tự Tay Bắn 1 Tin Nhắn Ngay Trên Giao Diện Web

1. Quay lại mục **Topics** -> Click vào **`pde-dev-events-topic`**.
2. Chuyển sang tab **`MESSAGES`** ở phía dưới -> Bấm nút **`PUBLISH MESSAGE`**.
3. Trong ô **Message body**, dán thử đoạn JSON đơn hàng sau:
   ```json
   {"event_id": "test-ui-001", "event_timestamp": "2026-10-27T10:00:00Z", "user_id": "USR-001", "event_type": "CHECKOUT", "order_amount": 99.50}
   ```
4. Bấm nút **`PUBLISH`** ở dưới cùng! Bạn vừa gửi thành công 1 sự kiện thời gian thực vào hệ thống.
