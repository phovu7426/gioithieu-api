# Đề Xuất Giải Pháp Xử Lý Tác Vụ Nền (Background Jobs) - Gửi Email Qua Hàng Đợi

Dựa trên yêu cầu của bạn về việc tối ưu hóa hiệu năng và trải nghiệm người dùng bằng cách xử lý các tác vụ không cần phản hồi tức thì (như email thông báo thành công) dưới nền, tôi đề xuất giải pháp sử dụng **Hàng đợi (Queue)** với **Redis**.

## 1. Vấn Đề Hiện Tại
Hiện tại, khi người dùng đăng ký hoặc reset mật khẩu:
1.  API xử lý logic (lưu DB).
2.  API gọi `ContentTemplateExecutionService` để render và gửi email (thông qua `Nodemailer`).
3.  User phải chờ toàn bộ quá trình này hoàn tất mới nhận được phản hồi từ API.

**Nhược điểm:**
*   Thời gian phản hồi API lâu hơn mức cần thiết.
*   Nếu mail server gặp sự cố (timeout, lỗi kết nối), process chính có thể bị ảnh hưởng hoặc user nhận được lỗi không đáng có dù thao tác DB đã thành công.

## 2. Giải Pháp Đề Xuất: NestJS Bull (Redis-based Queue)

Chúng ta sẽ sử dụng thư viện chuẩn `@nestjs/bull` (dựa trên BullMQ/Bull) kết hợp với Redis (đã có sẵn trong dự án) để quản lý hàng đợi.

### Kiến Trúc
*   **Producer (Người gửi):** `AuthService` sẽ thay vì gửi email trực tiếp, nó sẽ "đẩy" một yêu cầu (Job) vào hàng đợi Redis. Việc này cực nhanh (ms).
*   **Queue (Redis):** Lưu trữ các Job cần xử lý.
*   **Consumer (Người xử lý):** Một Service chạy ngầm (Worker) sẽ lấy Job từ Redis và thực hiện việc gửi email nặng nhọc.

### Phân Loại Tác Vụ
1.  **Critical (OTP):** Giữ nguyên gửi trực tiếp (Synchronous) hoặc dùng Queue độ ưu tiên cao nhất để tránh rủi ro độ trễ dù là nhỏ nhất.
2.  **Non-Critical (Success Notifications):** Đẩy vào Queue (Asynchronous).

## 3. Kế Hoạch Triển Khai Chi Tiết

### Bước 1: Cài đặt Dependencies
```bash
npm install @nestjs/bull bull
npm install --save-dev @types/bull
```

### Bước 2: Cấu hình Queue Module
Cấu hình chuẩn với rate limit để bảo vệ Mail Provider.

```typescript
// src/core/queue/queue.module.ts
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: 'localhost',
          port: 6379,
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'notification', 
      limiter: {
        max: 10,      // Tối đa 10 job
        duration: 1000, // Mỗi 1 giây (để tránh bị ban SMTP)
      }
    }),
  ],
  exports: [BullModule],
})
export class AppQueueModule {}
```

### Bước 3: Tạo Processor (Consumer)
Tạo class xử lý với cấu hình `concurrency` để xử lý song song.

```typescript
// src/modules/core/queue/processors/notification.processor.ts
@Processor('notification')
export class NotificationProcessor {
  constructor(
    private readonly contentTemplateService: ContentTemplateExecutionService
  ) {}

  @Process({
    name: 'send_email_template',
    concurrency: 5, // Xử lý 5 email cùng lúc trên 1 worker
  })
  async handleSendEmail(job: Job) {
    const { templateCode, options } = job.data;
    // ... logic gửi mail ...
  }
}
```

### Bước 4: Tích hợp vào AuthService (Producer)
Sử dụng `jobId` để tránh trùng lặp nếu cần.

```typescript
/* src/modules/core/auth/services/auth.service.ts */
// Example Usage
await this.notificationQueue.add('send_email_template', {
  templateCode: 'registration_success',
  options: { ... }
}, {
  jobId: `register-success-${userId}`, // JobId duy nhất, tránh add trùng
  attempts: 3, 
  backoff: 5000, 
  removeOnComplete: true
});
```

## 4. Mở Rộng Job Mới (Cập nhật)

Khi cần thêm các loại email khác (vd: Đơn hàng, Marketing,...), ta **KHÔNG** cần tạo thêm Queue mới mà hãy tận dụng lại Queue `notification` bằng cách phân loại Job Name.

### Nguyên Tắc Thiết Kế
*   **1 Queue = 1 Domain:** Gom chung các job liên quan đến thông báo (email, push noti, sms) vào queue `notification`.
*   **Job Name khác nhau:** Dùng tên Job để phân biệt logic xử lý.

### Ví Dụ: Thêm Job Email Đơn Hàng

**Producer (OrderService):**
```typescript
this.notificationQueue.add('send_order_email', { orderId: 123 }, { priority: 1 });
```

**Consumer (NotificationProcessor):**
```typescript
@Processor('notification')
export class NotificationProcessor {

  // Job cũ: Đăng ký thành công
  @Process('send_email_template')
  async handleSendEmail(job: Job) { ... }

  // Job mới: Đơn hàng (Ưu tiên concurrency cao hơn nếu cần)
  @Process({ name: 'send_order_email', concurrency: 10 })
  async handleOrderEmail(job: Job) {
     const { orderId } = job.data;
     // Logic lấy đơn hàng và gửi email...
  }
}
```

### Khi Nào Tách Queue Riêng?
Chỉ tách queue khi tính chất công việc khác hẳn nhau (SLA, tài nguyên):
*   `notification`: Email, Push (Nhẹ, nhiều, cần nhanh)
*   `report`: Xuất báo cáo Excel, PDF (Nặng, tốn CPU, có thể chậm)
*   `video_processing`: Xử lý video (Rất nặng, tốn GPU/CPU)

## 5. Phân Tích Hiệu Năng & Quy Mô

### Xử Lý 1000 Email
Với cấu hình `concurrency: 5` (an toàn) và giả sử mỗi email gửi mất 500ms:
*   Mỗi giây 1 worker xử lý được: (1000ms / 500ms) * 5 = 10 email.
*   **Tổng thời gian:** 1000 email / 10 email/s = **100 giây (~1.5 phút)**.
*   *Lưu ý:* Đây là xử lý ngầm, API phản hồi user ngay lập tức. Email đến chậm 1-2 phút khi có tải cao là hoàn toàn chấp nhận được.

### Vấn Đề Trùng Lặp (Concurrency)
*   **Concurrency:** Là xử lý SONG SONG các job KHÁC NHAU.
*   **Cơ chế:** Redis khóa (lock) job khi worker lấy ra xử lý -> Không bao giờ có chuyện 2 worker cùng xử lý 1 job.
*   **An toàn:** Đảm bảo 100% không gửi trùng email do xử lý song song.

## 6. Lợi Ích & Nhược Điểm

### Lợi Ích
1.  **Hiệu năng & Trải nghiệm:** API phản hồi tức thì.
2.  **Độ tin cậy:** Tự động retry khi lỗi, không làm mất email.
3.  **Tách biệt:** Tách logic gửi mail nặng nề ra khỏi luồng chính.
4.  **Kiểm soát tải:** Rate limiter giúp bảo vệ tài khoản SMTP không bị khóa.
5.  **Dễ Mở Rộng:** Thêm job type mới dễ dàng mà không làm vỡ cấu trúc.

### Nhược Điểm & Rủi Ro
1.  **Phụ thuộc Redis:** Cần Redis ổn định.
2.  **Khó Debug hơn:** Lỗi xảy ra ngầm, cần log đầy đủ.
3.  **Độ phức tạp:** Thêm code queue management.

## 7. Kết Luận
Giải pháp này là **tiêu chuẩn công nghiệp** cho hệ thống gửi email/notification. Nó cân bằng giữa hiệu năng API, độ tin cậy khi gửi mail và khả năng mở rộng.
