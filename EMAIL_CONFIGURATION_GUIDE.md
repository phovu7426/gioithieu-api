# Email Configuration Guide

## Lỗi SSL/TLS Thường Gặp

### Lỗi: "wrong version number"
```
C05F0000:error:0A00010B:SSL routines:tls_validate_record_header:wrong version number
```

**Nguyên nhân:** Cấu hình SSL/TLS không khớp với mail server.

**Giải pháp:** Đã fix trong `mail.service.ts` với logic tự động detect.

## Cấu Hình Theo Mail Provider

### 1. Gmail (Production)

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password  # Không phải password Gmail thường!
MAIL_FROM_NAME=Your App Name
MAIL_FROM_ADDRESS=your-email@gmail.com
```

**Lưu ý Gmail:**
- Phải tạo **App Password** (không dùng password Gmail thường)
- Bật 2FA trước khi tạo App Password
- Link: https://myaccount.google.com/apppasswords

### 2. Outlook/Office365

```env
MAIL_HOST=smtp.office365.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USERNAME=your-email@outlook.com
MAIL_PASSWORD=your-password
MAIL_FROM_NAME=Your App Name
MAIL_FROM_ADDRESS=your-email@outlook.com
```

### 3. SendGrid (Recommended for Production)

```env
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USERNAME=apikey
MAIL_PASSWORD=your-sendgrid-api-key
MAIL_FROM_NAME=Your App Name
MAIL_FROM_ADDRESS=verified-sender@yourdomain.com
```

### 4. Mailgun

```env
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USERNAME=postmaster@your-domain.mailgun.org
MAIL_PASSWORD=your-mailgun-password
MAIL_FROM_NAME=Your App Name
MAIL_FROM_ADDRESS=noreply@your-domain.com
```

### 5. Amazon SES

```env
MAIL_HOST=email-smtp.us-east-1.amazonaws.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USERNAME=your-smtp-username
MAIL_PASSWORD=your-smtp-password
MAIL_FROM_NAME=Your App Name
MAIL_FROM_ADDRESS=verified-email@yourdomain.com
```

### 6. Local Development (MailHog, MailCatcher, etc.)

```env
MAIL_HOST=localhost
MAIL_PORT=1025
MAIL_SECURE=false
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_NAME=Dev App
MAIL_FROM_ADDRESS=dev@localhost
```

**Cài đặt MailHog (Windows):**
```bash
# Download từ: https://github.com/mailhog/MailHog/releases
# Chạy: MailHog.exe
# Web UI: http://localhost:8025
```

### 7. Mailtrap (Testing)

```env
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_SECURE=false
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_FROM_NAME=Test App
MAIL_FROM_ADDRESS=test@example.com
```

## Port và Secure Settings

| Port | Secure | Protocol | Use Case |
|------|--------|----------|----------|
| 25   | false  | SMTP     | Legacy, often blocked |
| 465  | true   | SMTPS    | SSL/TLS from start |
| 587  | false  | SMTP     | STARTTLS (recommended) |
| 2525 | false  | SMTP     | Alternative (Mailtrap, etc.) |

## Logic Tự Động Trong Code

File: `src/core/mail/mail.service.ts`

```typescript
// Port 587 + secure=false → Dùng STARTTLS
if (config.smtp_port === 587 && !config.smtp_secure) {
  transportOptions.requireTLS = true;
  transportOptions.tls = {
    rejectUnauthorized: false, // Dev only
  };
}

// Localhost → Bỏ qua TLS
if (config.smtp_host === 'localhost' || config.smtp_host === '127.0.0.1') {
  transportOptions.ignoreTLS = true;
  if (!config.smtp_username || !config.smtp_password) {
    delete transportOptions.auth;
  }
}
```

## Testing Email Configuration

### 1. Qua API (Recommended)
```bash
POST /api/auth/send-otp-register
{
  "email": "your-test-email@gmail.com"
}
```

### 2. Qua Script
```typescript
// scripts/test-email.ts
import { MailService } from '@/core/mail/mail.service';

async function testEmail() {
  const mailService = // ... inject service
  
  await mailService.send({
    to: 'test@example.com',
    subject: 'Test Email',
    html: '<h1>Hello from NestJS!</h1>',
  });
  
  console.log('✅ Email sent successfully!');
}
```

### 3. Check Logs
```bash
# Xem logs khi gửi email
npm run start:dev

# Logs sẽ hiển thị:
# - Transporter config
# - Email sending status
# - Errors (nếu có)
```

## Troubleshooting

### Lỗi: Authentication failed
```
535 Authentication failed
```

**Giải pháp:**
- Kiểm tra username/password
- Gmail: Dùng App Password
- Outlook: Bật "Less secure app access"

### Lỗi: Connection timeout
```
ETIMEDOUT
```

**Giải pháp:**
- Kiểm tra firewall
- Kiểm tra port có bị block không
- Thử port khác (2525 thay vì 587)

### Lỗi: Self-signed certificate
```
CERT_HAS_EXPIRED
```

**Giải pháp:**
```typescript
tls: {
  rejectUnauthorized: false, // Chỉ dùng trong dev!
}
```

### Lỗi: Rate limit
```
550 Too many emails sent
```

**Giải pháp:**
- Dùng queue (đã implement)
- Giảm rate limit trong queue config
- Upgrade mail provider plan

## Production Checklist

- [ ] Sử dụng mail provider chuyên nghiệp (SendGrid, Mailgun, SES)
- [ ] Verify domain/email sender
- [ ] Cấu hình SPF, DKIM, DMARC records
- [ ] Sử dụng App Password (Gmail) hoặc API Key
- [ ] Set `rejectUnauthorized: true` (production)
- [ ] Monitor email delivery rate
- [ ] Setup bounce/complaint handling
- [ ] Implement retry logic (đã có trong queue)

## Environment-Specific Config

### Development
```env
MAIL_HOST=localhost
MAIL_PORT=1025
MAIL_SECURE=false
MAIL_USERNAME=
MAIL_PASSWORD=
```

### Staging
```env
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_SECURE=false
MAIL_USERNAME=staging-username
MAIL_PASSWORD=staging-password
```

### Production
```env
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USERNAME=apikey
MAIL_PASSWORD=${SENDGRID_API_KEY}
```

## Monitoring

### Check Email Config in DB
```sql
SELECT * FROM email_configs WHERE deleted_at IS NULL;
```

### Clear Email Config Cache
```typescript
// Sau khi update config trong admin panel
await mailService.clearConfigCache();
```

### Queue Monitoring
```bash
# Xem failed email jobs
redis-cli KEYS "bull:notification:failed"
```

## Best Practices

1. **Never commit credentials** - Use environment variables
2. **Use App Passwords** - Not regular passwords
3. **Verify senders** - Avoid spam folder
4. **Monitor delivery** - Track bounces and complaints
5. **Use queue** - Don't block API responses
6. **Test thoroughly** - Use Mailtrap/MailHog in dev
7. **Handle errors** - Retry failed emails
8. **Rate limiting** - Respect provider limits

## Support

Nếu vẫn gặp lỗi:
1. Check logs chi tiết
2. Test với Mailtrap trước
3. Verify config trong DB
4. Clear cache: `await mailService.clearConfigCache()`
