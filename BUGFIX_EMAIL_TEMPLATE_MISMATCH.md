# Fix: Email Template Mismatch Issue

## Vấn Đề
Khi gọi API gửi OTP đăng ký, nhận được email "Đăng ký thành công" thay vì email OTP.

## Nguyên Nhân
Template `send_otp_register` trong database có nội dung sai (có thể bị nhầm với `registration_success`).

## Giải Pháp Đã Thực Hiện

### 1. Cập Nhật Seeder
File: `src/core/database/seeder/seed-content-templates.ts`

**Trước:**
```typescript
if (!existing) {
    // Create new
} else {
    console.log(`Content template already exists: ${data.code}`);
    // ❌ Không update template cũ
}
```

**Sau:**
```typescript
if (!existing) {
    // Create new
} else {
    // ✅ Update existing template với nội dung mới
    await this.prisma.contentTemplate.update({
        where: { id: existing.id },
        data: {
            name: data.name,
            content: data.content,
            type: data.type,
            category: data.category,
            status: data.status,
            metadata: data.metadata as any,
        },
    });
    console.log(`🔄 Updated content template: ${data.code}`);
}
```

### 2. Chạy Seeder
```bash
npm run seed
```

**Kết quả:**
```
🔄 Updated content template: registration_success
🔄 Updated content template: reset_password_success
🔄 Updated content template: send_otp_register
🔄 Updated content template: send_otp_forgot_password
```

### 3. Restart Application
```bash
# Stop app (Ctrl+C)
npm run start:dev
```

## Xác Minh

### Template Đúng Trong DB

**send_otp_register:**
- Subject: "Mã xác thực đăng ký tài khoản"
- Content: Chứa mã OTP trong box màu xanh
- Variables: `{otp}`

**registration_success:**
- Subject: "Chào mừng bạn đến với hệ thống - Đăng ký thành công"
- Content: Thông báo đăng ký thành công, username, email
- Variables: `{name, username, email, loginUrl}`

### Flow Đúng

1. **POST /auth/send-otp-register**
   - Code: `await this.contentTemplateService.execute('send_otp_register', ...)`
   - Email: "Mã Xác Thực Đăng Ký" với OTP

2. **POST /auth/register** (với OTP đúng)
   - Code: `await this.notificationQueue.add('send_email_template', { templateCode: 'registration_success', ... })`
   - Email: "Đăng Ký Tài Khoản Thành Công"

## Test Lại

1. Gọi API: `POST /auth/send-otp-register`
   ```json
   {
     "email": "test@example.com"
   }
   ```

2. Kiểm tra email:
   - ✅ Subject: "Mã xác thực đăng ký tài khoản"
   - ✅ Content: Chứa mã OTP 6 số
   - ✅ Không phải email "Đăng ký thành công"

3. Sau khi đăng ký thành công với OTP:
   ```json
   {
     "email": "test@example.com",
     "otp": "123456",
     "password": "password123",
     "name": "Test User"
   }
   ```

4. Kiểm tra email thứ 2:
   - ✅ Subject: "Chào mừng bạn đến với hệ thống - Đăng ký thành công"
   - ✅ Content: Thông báo đăng ký thành công

## Lưu Ý Quan Trọng

### Tại Sao Cần Update Seeder?

Seeder cũ chỉ **tạo mới** template nếu chưa tồn tại, nhưng **không update** nếu đã có. Điều này gây ra vấn đề khi:
- Template trong code được sửa
- Template trong DB vẫn giữ nội dung cũ (sai)

### Best Practice

Khi thay đổi template trong code:
1. Cập nhật file seeder
2. Chạy `npm run seed` để update DB
3. Restart app để clear cache (nếu có)

### Kiểm Tra Template Trong DB

```sql
SELECT code, name, metadata->>'$.subject' as subject
FROM content_templates
WHERE deleted_at IS NULL;
```

Hoặc qua API admin (nếu có).
