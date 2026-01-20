# Kế hoạch phát triển tính năng Comment và View Statistics cho Module Post (Revised)

Tài liệu này mô tả thiết kế cơ sở dữ liệu chuyên biệt và kế hoạch triển khai cho hai tính năng: Bình luận bài viết và Thống kê lượt xem (View Stats).

## 1. Thiết kế cơ sở dữ liệu (Database Design)

Chúng ta sẽ tạo các bảng mới riêng biệt để đảm bảo tính mở rộng và dễ dàng thống kê.

### 1.1. Model `PostComment`
Bảng riêng biệt dành cho bình luận của bài viết.

```prisma
model PostComment {
  id              BigInt        @id @default(autoincrement()) @db.UnsignedBigInt
  post_id         BigInt        @db.UnsignedBigInt
  user_id         BigInt?       @db.UnsignedBigInt // Optional cho khách
  guest_name      String?       @db.VarChar(255)   // Tên khách nếu chưa đăng nhập
  guest_email     String?       @db.VarChar(255)   // Email khách nếu chưa đăng nhập
  parent_id       BigInt?       @db.UnsignedBigInt
  content         String        @db.Text
  status          CommentStatus @default(visible)
  
  created_user_id BigInt?       @db.UnsignedBigInt
  updated_user_id BigInt?       @db.UnsignedBigInt
  created_at      DateTime      @default(now()) @db.DateTime(0)
  updated_at      DateTime      @updatedAt @db.DateTime(0)
  deleted_at      DateTime?     @db.DateTime(0)

  // Relations
  post    Post         @relation("PostToPostComments", fields: [post_id], references: [id], onDelete: Cascade)
  user    User?        @relation(fields: [user_id], references: [id], onDelete: Cascade)
  parent  PostComment? @relation("PostCommentToReplies", fields: [parent_id], references: [id], onDelete: Cascade)
  replies PostComment[] @relation("PostCommentToReplies")

  @@index([post_id], map: "idx_post_comment_post_id")
  @@index([user_id], map: "idx_post_comment_user_id")
  @@index([parent_id], map: "idx_post_comment_parent_id")
  @@index([status], map: "idx_post_comment_status")
  @@map("post_comments")
}
```

### 1.2. Model `PostViewStats` (Bảng thống kê tổng hợp)
Lưu trữ lượt xem đã được tổng hợp theo từng ngày của từng bài viết.

```prisma
model PostViewStats {
  id         BigInt   @id @default(autoincrement()) @db.UnsignedBigInt
  post_id    BigInt   @db.UnsignedBigInt
  view_date  DateTime @db.Date // Ngày thống kê
  view_count Int      @default(0)
  updated_at DateTime @updatedAt @db.DateTime(0)

  post Post @relation("PostToViewStats", fields: [post_id], references: [id], onDelete: Cascade)

  @@unique([post_id, view_date], map: "idx_post_date_unique")
  @@map("post_view_stats")
}
```

### 1.3. Cập nhật Model `Post`
```prisma
model Post {
  // ... các trường hiện tại ...
  post_comments      PostComment[]   @relation("PostToPostComments")
  view_stats         PostViewStats[] @relation("PostToViewStats")
}
```

---

## 2. Kế hoạch triển khai (Implementation Plan)

### Bước 1: Cập nhật Database
1.  Chỉnh sửa `prisma/schema.prisma` thêm 2 model `PostComment` và `PostViewStats`.
2.  Chạy migration để cập nhật cấu trúc bảng.

### Bước 2: Triển khai tính năng Thống kê lượt xem với Redis & Cron Job
1.  **Ghi nhận lượt xem vào Redis (Real-time)**:
    - Sử dụng Redis Hash (ví dụ: `post:views:buffer`) để lưu trữ số lượt tăng thêm.
    - Key: `post_id`, Value: `số lượt xem tăng thêm`.
    - Khi có người xem bài viết: `HINCRBY post:views:buffer <post_id> 1`.
2.  **Cron Job đồng bộ vào DB (Mỗi 5 phút)**:
    - Sử dụng `@Cron('*/5 * * * *')` trong NestJS.
    - B1: Đọc toàn bộ dữ liệu từ `post:views:buffer` và đồng thời đổi tên key Redis (để tránh mất dữ liệu trong lúc xử lý).
    - B2: Duyệt qua danh sách `post_id` và số lượt tăng tương ứng.
    - B3: Cập nhật `view_count` trong bảng `Post`.
    - B4: `Upsert` vào bảng `PostViewStats` để cộng dồn vào thống kê của ngày hiện tại.
    - B5: Xóa dữ liệu buffer cũ trong Redis.
2.  **API Thống kê (Admin)**:
    - `GET /admin/posts/:id/stats`: Trả về dữ liệu lượt xem theo khoảng ngày để vẽ biểu đồ (Chart.js/Recharts).

### Bước 3: Triển khai tính năng Bình luận (Post Comments)
1.  **Backend**:
    - Tạo `PostCommentModule`, `Controller`, `Service`.
    - Triển khai CRUD cho bình luận.
    - Logic phân cấp: Trả về danh sách bình luận kèm theo các `replies` con.
2.  **Bảo mật**:
    - Chỉ người dùng đã đăng nhập mới được bình luận.
    - Admin có quyền duyệt/ẩn/xóa bình luận.

### Bước 4: Tích hợp Frontend
1.  **Giao diện Bài viết**: Thêm phần danh sách bình luận và form gửi bình luận.
2.  **Dashboard Admin**: Thêm biểu đồ thống kê lượt xem bài viết theo thời gian (7 ngày qua, 30 ngày qua).

---

## 3. Lợi ích của thiết kế này
- **Hiệu năng**: Tách bảng bình luận giúp truy vấn nhanh hơn khi dữ liệu lớn.
- **Khả năng phân tích**: Bảng `PostViewStats` cho phép biết chính xác ngày nào bài viết hot nhất, xu hướng đọc bài của người dùng.
- **Tính độc lập**: Không ảnh hưởng đến module Comic hiện có.
