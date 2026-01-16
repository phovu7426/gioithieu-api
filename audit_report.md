# Đánh giá dự án `gioithieu-api`

Dựa trên việc phân tích mã nguồn của project (NestJS, Prisma, MySQL), dưới đây là báo cáo chi tiết về hiệu năng, bảo mật, cấu trúc và các thứ cần cải thiện.

## 1. Tổng quan vấn đề nghiêm trọng (Critical Issues)

Những vấn đề này cần được khắc phục **NGAY LẬP TỨC** vì chúng ảnh hưởng trực tiếp đến khả năng vận hành và bảo mật của hệ thống.

### 🔴 1.1. Lỗi Serialization `BigInt` (Sắp xảy ra crash)
- **Vấn đề**: Database sử dụng `BigInt` cho hầu hết các trường ID (`id BigInt @id`). Tuy nhiên, JavaScript `JSON.stringify` mặc định **không thể serialize BigInt** và sẽ ném ra lỗi `TypeError: Do not know how to serialize a BigInt`.
- **Hiện trạng**: Kiểm tra `src/main.ts`, `src/app.module.ts` và `TransformInterceptor` đều không thấy đoạn code nào xử lý việc chuyển `BigInt` sang `String` hoặc `Number` trước khi trả về client.
- **Hậu quả**: Mọi API trả về dữ liệu chứa ID sẽ bị lỗi 500 Internal Server Error.
- **Giải pháp**: Thêm polyfill cho `BigInt.prototype.toJSON` trong `main.ts` hoặc sử dụng `ClassSerializerInterceptor` với cấu hình đúng.

---

## 2. Bảo mật (Security)

### ⚠️ 2.1. DoS qua File Upload
- **Vấn đề**: Sử dụng `fs.writeFileSync(filePath, file.buffer)` trong `LocalStorageStrategy`.
- **Phân tích**:
    - `file.buffer` nghĩa là toàn bộ file được load vào RAM. Với limit 100MB, chỉ cần 10-20 request đồng thời là server sẽ bị **Out of Memory (OOM)** và crash.
    - `writeFileSync` là hàm đồng bộ (blocking), nó sẽ chặn Event Loop của Node.js trong khi ghi file đĩa, làm treo toàn bộ server với các request khác.
- **Giải pháp**: Sử dụng `fs.createWriteStream` (stream) để ghi file và cấu hình Multer để stream file thay vì buffer vào RAM.

### ⚠️ 2.2. Hiệu năng Authentication (JWT)
- **Vấn đề**: `JwtStrategy` truy vấn database (`prisma.user.findFirst`) trong **mọi request** để validate user.
    ```typescript
    // JwtStrategy.validate
    const user = await this.prisma.user.findFirst(...)
    ```
- **Phân tích**: Việc này biến JWT (stateless) thành stateful session, làm mất đi ưu điểm hiệu năng của JWT. Với lượng traffic lớn, DB sẽ bị quá tải.
- **Giải pháp**:
    - Cache thông tin user vào Redis.
    - Hoặc chấp nhận tin tưởng payload trong JWT (nguy cơ: không thu hồi được token tức thì trừ khi dùng blacklist - project đã có cơ chế blacklist).

### ✅ Điểm tốt
- Đã có cơ chế **Account Lockout** (khóa tài khoản sau nhiều lần đăng nhập sai) dùng Redis.
- Sử dụng `Helmet` để bảo mật HTTP headers.
- Sử dụng `bcrypt` để hash password.

---

## 3. Hiệu năng (Performance)

### ⚠️ 3.1. Database Indexing
- **Hiện trạng**: Project khai báo rất nhiều index trong `schema.prisma` (`@@index`).
- **Lưu ý**: Dù index giúp tăng tốc đọc (`SELECT`), nhưng quá nhiều index sẽ làm chậm thao tác ghi (`INSERT`, `UPDATE`, `DELETE`) và tốn dung lượng lưu trữ. Cần review lại xem các index như `idx_deleted_at` có thực sự cần thiết trên mọi bảng không nếu logic xóa mềm ít khi được query.

### ⚠️ 3.2. Response Transformation
- **Vấn đề**: `TransformInterceptor` wrap mọi response data.
- **Phân tích**: Logic khá tiêu chuẩn, nhưng cần đảm bảo nó không gây overhead lớn với các response json khổng lồ.

---

## 4. Cấu trúc Project & Code Quality

### ⚠️ 4.1. Cấu trúc Module gây nhầm lẫn
- **Hiện trạng**: Có thư mục `src/common` (global utils) và `src/modules/common` (chứa feature modules như auth, user, upload).
- **Nhận xét**: Cách đặt tên này cực kỳ dễ gây nhầm lẫn cho người mới tham gia dự án.
- **Giải pháp**: Đổi tên `src/modules/common` thành `src/modules/core-features` hoặc `src/modules/system`.

### ⚠️ 4.2. Main.ts rườm rà
- **Hiện trạng**: File `main.ts` chứa quá nhiều logic cấu hình (CORS thủ công, static file serving, logging config).
- **Giải pháp**: Tách các phần này ra các file `bootstrap` riêng biệt (đã làm một phần, nhưng vẫn còn nhiều logic trong main).

### ℹ️ 4.3. Type Safety
- **Hiện trạng**: `BigInt` của Prisma chưa được xử lý type chuẩn trong DTO trả về (liên quan lỗi serialization ở trên). Các DTO cần dùng `class-transformer` để đảm bảo type chính xác khi trả về client.

---

## 5. Kết luận & Đề xuất lộ trình

Project có nền tảng công nghệ tốt (NestJS + Prisma + Redis), cấu trúc phân chia module rõ ràng. Tuy nhiên, đang tồn tại **lỗ hổng bảo mật nghiêm trọng (File Upload)** và **lỗi kỹ thuật chí mạng (BigInt Serialization)** chưa phù hợp để production.

### ✅ Những gì đã làm tốt:
- Stack công nghệ hiện đại.
- Có chia module, mô hình RBAC (Role-Based Access Control) khá chi tiết.
- Sử dụng Redis, rate limiting.

### 🛠️ Việc cần làm ngay:
1.  **Fix Serialization**: Xử lý `BigInt` toàn cục.
2.  **Fix Security**: Validate file upload, chặn file thực thi.
3.  **Refactor**: Đổi `writeFileSync` sang stream.
