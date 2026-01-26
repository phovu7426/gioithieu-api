# Queue Implementation Guide

## Tổng Quan

Hệ thống queue đã được triển khai sử dụng **@nestjs/bull** với **Redis** để xử lý các tác vụ nền (background jobs), đặc biệt là gửi email.

## Cấu Trúc

```
src/
├── core/
│   └── queue/
│       └── queue.module.ts          # Cấu hình BullMQ với Redis
├── modules/
│   └── core/
│       └── queue/
│           ├── queue.module.ts      # QueueWorkerModule - đăng ký processors
│           └── processors/
│               └── notification.processor.ts  # Xử lý email jobs
```

## Cách Hoạt Động

### 1. Producer (Người gửi job)
Ví dụ trong `AuthService`:

```typescript
// Gửi email thông báo đăng ký thành công vào queue
this.notificationQueue.add('send_email_template', {
  templateCode: 'registration_success',
  options: {
    to: saved.email!,
    variables: { ... },
  },
}, {
  jobId: `register-success-${saved.id}`,  // ID duy nhất tránh trùng lặp
  attempts: 3,                             // Thử lại 3 lần nếu lỗi
  backoff: 5000,                           // Đợi 5s giữa các lần retry
  removeOnComplete: true,                  // Xóa job sau khi hoàn thành
});
```

### 2. Consumer (Processor xử lý job)
File: `src/modules/core/queue/processors/notification.processor.ts`

```typescript
@Processor('notification')
export class NotificationProcessor {
  @Process('send_email_template')
  async handleSendEmail(job: Job) {
    const { templateCode, options } = job.data;
    await this.contentTemplateService.execute(templateCode, options);
  }
}
```

## Phân Loại Email

### Critical (OTP) - Gửi Trực Tiếp
- `send_otp_register`
- `send_otp_forgot_password`

**Lý do:** Cần gửi ngay lập tức, user đang chờ mã OTP.

### Non-Critical - Gửi Qua Queue
- `registration_success`
- `reset_password_success`

**Lý do:** Không cần phản hồi tức thì, có thể chậm vài giây không ảnh hưởng UX.

## Mở Rộng: Thêm Job Mới

### Ví Dụ: Email Đơn Hàng

#### Bước 1: Thêm Processor Method
File: `src/modules/core/queue/processors/notification.processor.ts`

```typescript
@Processor('notification')
export class NotificationProcessor {
  // ... existing methods ...

  @Process({ name: 'send_order_email', concurrency: 10 })
  async handleOrderEmail(job: Job) {
    const { orderId } = job.data;
    
    // Lấy thông tin đơn hàng
    const order = await this.orderService.findById(orderId);
    
    // Gửi email
    await this.contentTemplateService.execute('order_confirmation', {
      to: order.customerEmail,
      variables: {
        orderNumber: order.number,
        items: order.items,
        total: order.total,
      },
    });
  }
}
```

#### Bước 2: Inject Queue vào Service
File: `src/modules/order/order.service.ts`

```typescript
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class OrderService {
  constructor(
    @InjectQueue('notification')
    private readonly notificationQueue: Queue,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    const order = await this.orderRepo.create(dto);
    
    // Đẩy job vào queue
    await this.notificationQueue.add('send_order_email', {
      orderId: order.id,
    }, {
      priority: 1,  // Ưu tiên cao hơn email thông báo thường
      attempts: 3,
      backoff: 5000,
    });
    
    return order;
  }
}
```

#### Bước 3: Đăng ký Queue trong Module
File: `src/modules/order/order.module.ts`

```typescript
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notification',
    }),
    // ... other imports
  ],
  // ...
})
export class OrderModule {}
```

## Khi Nào Tách Queue Riêng?

**Dùng chung queue `notification`** cho:
- Email
- Push notifications
- SMS
- Các thông báo nhẹ

**Tách queue riêng** khi:
- Tính chất công việc khác hẳn (CPU/Memory intensive)
- SLA khác nhau (ví dụ: báo cáo có thể chậm 1 giờ)

### Ví Dụ: Queue Báo Cáo

```typescript
// src/core/queue/queue.module.ts
BullModule.registerQueue(
  {
    name: 'notification',
    limiter: { max: 10, duration: 1000 },
  },
  {
    name: 'report',
    limiter: { max: 2, duration: 1000 },  // Chậm hơn vì nặng
    defaultJobOptions: {
      attempts: 1,
      timeout: 300000,  // 5 phút timeout
    },
  }
),
```

## Cấu Hình Redis

File: `.env`

```env
REDIS_URL=redis://localhost:6379
```

Hoặc:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Monitoring & Debugging

### Xem Jobs trong Redis
```bash
redis-cli
> KEYS bull:notification:*
> HGETALL bull:notification:1
```

### Logs
Processor tự động log:
- `Processing job ${job.id}: send_email_template`
- `Job ${job.id} completed`
- `Job ${job.id} failed` (nếu lỗi)

## Hiệu Năng

### Cấu Hình Mặc Định
- **Rate Limit:** 10 jobs/giây
- **Concurrency:** 1 (mặc định, có thể tăng trong `@Process`)
- **Retry:** 3 lần với exponential backoff

### Ví Dụ Tính Toán
Với 1000 email, mỗi email mất 500ms:
- **Thời gian xử lý:** ~100 giây (1.5 phút)
- **API response time:** < 100ms (không chờ email)

## Best Practices

1. **JobId duy nhất:** Tránh gửi trùng email
   ```typescript
   jobId: `register-success-${userId}`
   ```

2. **Retry hợp lý:** Không retry vô hạn
   ```typescript
   attempts: 3,
   backoff: { type: 'exponential', delay: 1000 }
   ```

3. **Cleanup:** Xóa job sau khi hoàn thành
   ```typescript
   removeOnComplete: true,
   removeOnFail: false,  // Giữ lại để debug
   ```

4. **Error Handling:** Luôn catch và log
   ```typescript
   .catch(err => console.error('Failed to queue email', err))
   ```

## Troubleshooting

### Job không chạy
- Kiểm tra Redis đã chạy: `redis-cli ping`
- Kiểm tra QueueWorkerModule đã import vào CoreModulesModule
- Xem logs của NotificationProcessor

### Email gửi trùng
- Sử dụng `jobId` duy nhất
- Kiểm tra logic tạo jobId

### Queue bị tắc
- Tăng `concurrency` trong `@Process`
- Tăng `limiter.max` nếu mail provider cho phép
- Kiểm tra Redis memory

## Tài Liệu Tham Khảo
- [NestJS Bull Documentation](https://docs.nestjs.com/techniques/queues)
- [Bull Documentation](https://github.com/OptimalBits/bull)
- [BullMQ (Bull v4)](https://docs.bullmq.io/)
