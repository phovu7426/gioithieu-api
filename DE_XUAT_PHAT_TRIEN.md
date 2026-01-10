# Đề Xuất Phát Triển Web Giới Thiệu Công Ty Xây Dựng

## 📊 Các Bảng Hiện Có (Có Thể Tái Sử Dụng)

- ✅ `banners`, `banner_locations` - Quản lý banner
- ✅ `posts`, `postcategory`, `posttag` - Blog/Tin tức
- ✅ `contacts` - Form liên hệ
- ✅ `general_configs` - Cấu hình chung
- ✅ `users`, `profiles` - Quản lý user
- ✅ `menus` - Menu hệ thống
- ✅ `notifications` - Thông báo

## ➕ Danh Sách Bảng DB Được Cải Tiến

Dựa trên tham khảo website romanproperty.vn và phân tích nhu cầu thực tế, danh sách bảng được tối ưu như sau:

### 1. Projects (Dự án) - **QUAN TRỌNG**
```prisma
model Project {
  id                BigInt      @id @default(autoincrement()) @db.UnsignedBigInt
  name              String      @db.VarChar(255)
  slug              String      @unique @db.VarChar(255)
  description       String?     @db.Text
  short_description String?     @db.VarChar(500)
  cover_image       String?     @db.VarChar(500)
  location          String?     @db.VarChar(255)  // Địa điểm
  area              Decimal?    @db.Decimal(15, 2)  // Diện tích (m²)
  start_date        DateTime?   @db.DateTime(0)
  end_date          DateTime?   @db.DateTime(0)
  status            ProjectStatus @default(planning)
  client_name       String?     @db.VarChar(255)  // Tên chủ đầu tư
  budget            Decimal?    @db.Decimal(20, 2)  // Ngân sách
  images            Json?       // Mảng ảnh dự án
  featured          Boolean     @default(false)
  view_count        BigInt      @default(0) @db.UnsignedBigInt
  sort_order        Int         @default(0)
  meta_title        String?     @db.VarChar(255)
  meta_description  String?     @db.Text
  canonical_url     String?     @db.VarChar(500)
  og_image          String?     @db.VarChar(500)
  created_user_id   BigInt?     @db.UnsignedBigInt
  updated_user_id   BigInt?     @db.UnsignedBigInt
  created_at        DateTime    @default(now()) @db.DateTime(0)
  updated_at        DateTime    @updatedAt @db.DateTime(0)
  deleted_at        DateTime?   @db.DateTime(0)

  @@index([slug], map: "idx_projects_slug")
  @@index([status], map: "idx_projects_status")
  @@index([featured], map: "idx_projects_featured")
  @@index([sort_order], map: "idx_projects_sort_order")
  @@index([created_at], map: "idx_projects_created_at")
  @@index([status, featured], map: "idx_projects_status_featured")
  @@index([deleted_at], map: "idx_projects_deleted_at")
  @@map("projects")
}

enum ProjectStatus {
  planning
  in_progress
  completed
  cancelled
}
```

**Lý do:** Bảng này là core của website giới thiệu công ty xây dựng. Không cần ProjectCategories vì có thể dùng tags hoặc phân loại đơn giản bằng status/featured.

---

### 2. Staff (Đội ngũ nhân viên) - **QUAN TRỌNG**
```prisma
model Staff {
  id              BigInt      @id @default(autoincrement()) @db.UnsignedBigInt
  name            String      @db.VarChar(255)
  position        String      @db.VarChar(255)  // Chức vụ
  department      String?     @db.VarChar(255)  // Phòng ban
  bio             String?     @db.Text
  avatar          String?     @db.VarChar(500)
  email           String?     @db.VarChar(255)
  phone           String?     @db.VarChar(20)
  social_links    Json?       // Facebook, LinkedIn, v.v.
  experience      Int?        // Số năm kinh nghiệm
  expertise       String?     @db.Text  // Chuyên môn
  status          BasicStatus @default(active)
  sort_order      Int         @default(0)
  created_user_id BigInt?     @db.UnsignedBigInt
  updated_user_id BigInt?     @db.UnsignedBigInt
  created_at      DateTime    @default(now()) @db.DateTime(0)
  updated_at      DateTime    @updatedAt @db.DateTime(0)
  deleted_at      DateTime?   @db.DateTime(0)

  @@index([status], map: "idx_staff_status")
  @@index([sort_order], map: "idx_staff_sort_order")
  @@index([department], map: "idx_staff_department")
  @@index([deleted_at], map: "idx_staff_deleted_at")
  @@map("staff")
}
```

**Lý do:** Đổi tên từ TeamMember sang Staff cho rõ ràng hơn. Cần thiết để giới thiệu đội ngũ công ty.

---

### 3. Testimonials (Lời chứng thực/Khách hàng nói gì)
```prisma
model Testimonial {
  id              BigInt      @id @default(autoincrement()) @db.UnsignedBigInt
  client_name     String      @db.VarChar(255)
  client_position String?     @db.VarChar(255)  // Chức vụ khách hàng
  client_company  String?     @db.VarChar(255)  // Công ty khách hàng
  client_avatar   String?     @db.VarChar(500)
  content         String      @db.Text
  rating          Int?        @db.UnsignedTinyInt  // 1-5 sao
  project_id      BigInt?     @db.UnsignedBigInt  // Liên kết với dự án (nếu có)
  featured        Boolean     @default(false)
  status          BasicStatus @default(active)
  sort_order      Int         @default(0)
  created_user_id BigInt?     @db.UnsignedBigInt
  updated_user_id BigInt?     @db.UnsignedBigInt
  created_at      DateTime    @default(now()) @db.DateTime(0)
  updated_at      DateTime    @updatedAt @db.DateTime(0)
  deleted_at      DateTime?   @db.DateTime(0)

  project Project? @relation(fields: [project_id], references: [id], onDelete: SetNull)

  @@index([status], map: "idx_testimonials_status")
  @@index([featured], map: "idx_testimonials_featured")
  @@index([project_id], map: "idx_testimonials_project_id")
  @@index([sort_order], map: "idx_testimonials_sort_order")
  @@index([deleted_at], map: "idx_testimonials_deleted_at")
  @@map("testimonials")
}
```

**Lý do:** Tăng độ tin cậy, xây dựng niềm tin với khách hàng.

---

### 4. Gallery (Thư viện ảnh)
```prisma
model Gallery {
  id              BigInt      @id @default(autoincrement()) @db.UnsignedBigInt
  title           String      @db.VarChar(255)
  slug            String      @unique @db.VarChar(255)
  description     String?     @db.Text
  cover_image     String?     @db.VarChar(500)
  images          Json        // Mảng ảnh
  featured        Boolean     @default(false)
  status          BasicStatus @default(active)
  sort_order      Int         @default(0)
  created_user_id BigInt?     @db.UnsignedBigInt
  updated_user_id BigInt?     @db.UnsignedBigInt
  created_at      DateTime    @default(now()) @db.DateTime(0)
  updated_at      DateTime    @updatedAt @db.DateTime(0)
  deleted_at      DateTime?   @db.DateTime(0)

  @@index([slug], map: "idx_gallery_slug")
  @@index([status], map: "idx_gallery_status")
  @@index([featured], map: "idx_gallery_featured")
  @@index([sort_order], map: "idx_gallery_sort_order")
  @@index([deleted_at], map: "idx_gallery_deleted_at")
  @@map("gallery")
}
```

**Lý do:** Cần thiết để showcase công trình, dự án. Không cần GalleryCategory vì có thể dùng tags hoặc phân loại đơn giản bằng featured/status.

---

### 5. Partners (Đối tác/Khách hàng)
```prisma
model Partner {
  id              BigInt      @id @default(autoincrement()) @db.UnsignedBigInt
  name            String      @db.VarChar(255)
  logo            String      @db.VarChar(500)
  website         String?     @db.VarChar(500)
  description     String?     @db.Text
  type            PartnerType  @default(client)
  status          BasicStatus @default(active)
  sort_order      Int         @default(0)
  created_user_id BigInt?     @db.UnsignedBigInt
  updated_user_id BigInt?     @db.UnsignedBigInt
  created_at      DateTime    @default(now()) @db.DateTime(0)
  updated_at      DateTime    @updatedAt @db.DateTime(0)
  deleted_at      DateTime?   @db.DateTime(0)

  @@index([type], map: "idx_partners_type")
  @@index([status], map: "idx_partners_status")
  @@index([sort_order], map: "idx_partners_sort_order")
  @@index([deleted_at], map: "idx_partners_deleted_at")
  @@map("partners")
}

enum PartnerType {
  client
  supplier
  partner
}
```

**Lý do:** Thể hiện uy tín, mối quan hệ hợp tác.

---

### 6. Certificates (Chứng chỉ/Giải thưởng)
```prisma
model Certificate {
  id                BigInt          @id @default(autoincrement()) @db.UnsignedBigInt
  name              String          @db.VarChar(255)
  image             String          @db.VarChar(500)
  issued_by         String?         @db.VarChar(255)  // Cấp bởi
  issued_date       DateTime?       @db.DateTime(0)
  expiry_date       DateTime?       @db.DateTime(0)
  certificate_number String?         @db.VarChar(100)  // Số chứng chỉ
  description       String?         @db.Text
  type              CertificateType @default(license)
  status            BasicStatus     @default(active)
  sort_order        Int             @default(0)
  created_user_id   BigInt?         @db.UnsignedBigInt
  updated_user_id   BigInt?         @db.UnsignedBigInt
  created_at        DateTime        @default(now()) @db.DateTime(0)
  updated_at        DateTime        @updatedAt @db.DateTime(0)
  deleted_at        DateTime?       @db.DateTime(0)

  @@index([type], map: "idx_certificates_type")
  @@index([status], map: "idx_certificates_status")
  @@index([sort_order], map: "idx_certificates_sort_order")
  @@index([deleted_at], map: "idx_certificates_deleted_at")
  @@map("certificates")
}

enum CertificateType {
  iso
  award
  license
  certification
  other
}
```

**Lý do:** Thể hiện năng lực, uy tín của công ty.

---

### 7. About (Giới thiệu công ty)
```prisma
model AboutSection {
  id              BigInt          @id @default(autoincrement()) @db.UnsignedBigInt
  title           String          @db.VarChar(255)
  slug            String          @unique @db.VarChar(255)
  content         String          @db.LongText
  image           String?         @db.VarChar(500)
  video_url       String?         @db.VarChar(500)
  section_type    AboutSectionType @default(history)
  status          BasicStatus     @default(active)
  sort_order      Int             @default(0)
  created_user_id BigInt?         @db.UnsignedBigInt
  updated_user_id BigInt?         @db.UnsignedBigInt
  created_at      DateTime        @default(now()) @db.DateTime(0)
  updated_at      DateTime        @updatedAt @db.DateTime(0)
  deleted_at      DateTime?       @db.DateTime(0)

  @@index([slug], map: "idx_about_sections_slug")
  @@index([section_type], map: "idx_about_sections_type")
  @@index([status], map: "idx_about_sections_status")
  @@index([sort_order], map: "idx_about_sections_sort_order")
  @@index([deleted_at], map: "idx_about_sections_deleted_at")
  @@map("about_sections")
}

enum AboutSectionType {
  history
  mission
  vision
  values
  culture
  achievement
  other
}
```

**Lý do:** Cần thiết cho trang "Giới thiệu" trên website.

---

### 8. FAQs (Câu hỏi thường gặp)
```prisma
model Faq {
  id              BigInt      @id @default(autoincrement()) @db.UnsignedBigInt
  question        String      @db.Text
  answer          String      @db.LongText
  view_count      BigInt      @default(0) @db.UnsignedBigInt
  helpful_count   BigInt      @default(0) @db.UnsignedBigInt
  status          BasicStatus @default(active)
  sort_order      Int         @default(0)
  created_user_id BigInt?     @db.UnsignedBigInt
  updated_user_id BigInt?     @db.UnsignedBigInt
  created_at      DateTime    @default(now()) @db.DateTime(0)
  updated_at      DateTime    @updatedAt @db.DateTime(0)
  deleted_at      DateTime?   @db.DateTime(0)

  @@index([status], map: "idx_faqs_status")
  @@index([sort_order], map: "idx_faqs_sort_order")
  @@index([view_count], map: "idx_faqs_view_count")
  @@index([deleted_at], map: "idx_faqs_deleted_at")
  @@map("faqs")
}
```

**Lý do:** Hỗ trợ khách hàng, giảm tải công việc tư vấn. Không cần FaqCategory vì có thể dùng tags hoặc phân loại đơn giản.

---

## 📋 Tổng Kết Danh Sách Bảng DB

### Bảng Hiện Có (Tái Sử Dụng)
1. ✅ `banners`, `banner_locations`
2. ✅ `posts`, `postcategory`, `posttag`
3. ✅ `contacts`
4. ✅ `general_configs`
5. ✅ `users`, `profiles`
6. ✅ `menus`
7. ✅ `notifications`

### Bảng Mới Cần Tạo
1. ✅ **Projects** - Quản lý dự án
2. ✅ **Staff** - Đội ngũ nhân viên
3. ✅ **Testimonials** - Lời chứng thực
4. ✅ **Gallery** - Thư viện ảnh
5. ✅ **Partners** - Đối tác/Khách hàng
6. ✅ **Certificates** - Chứng chỉ/Giải thưởng
7. ✅ **AboutSection** - Giới thiệu công ty
8. ✅ **Faq** - Câu hỏi thường gặp

### Tổng Cộng: 8 bảng mới + 7 nhóm bảng hiện có = **15 nhóm bảng**

---

## 📋 Ưu Tiên Triển Khai

### Phase 1 (Bắt buộc - Core)
1. ✅ **Projects** - Quản lý dự án (QUAN TRỌNG NHẤT)
2. ✅ **AboutSection** - Giới thiệu công ty
3. ✅ **Staff** - Đội ngũ nhân viên

### Phase 2 (Quan trọng)
4. ✅ **Testimonials** - Lời chứng thực
5. ✅ **Partners** - Đối tác/Khách hàng
6. ✅ **Gallery** - Thư viện ảnh

### Phase 3 (Bổ sung)
7. ✅ **Certificates** - Chứng chỉ/Giải thưởng
8. ✅ **Faq** - Câu hỏi thường gặp

---

## 🔧 Cần Sửa/Thêm

### 1. Xóa/Ẩn Module Comics
- Module `comics` không cần cho web giới thiệu công ty
- Có thể xóa hoặc comment lại trong `app.module.ts`

### 2. Tạo .env.example
- File hướng dẫn cấu hình môi trường

### 3. Thêm Swagger
- Tự động generate API documentation

### 4. SEO & Performance
- Sitemap generation
- Meta tags optimization
- Image optimization

---

## 📝 Ghi Chú Quan Trọng

1. **Tận dụng bảng hiện có:**
   - Dùng `posts` cho tin tức/blog
   - Dùng `posttag` cho tags của Projects, Gallery
   - Dùng `postcategory` nếu cần phân loại phức tạp hơn

2. **Đơn giản hóa:**
   - Loại bỏ các bảng category không cần thiết
   - Dùng status, featured, tags để phân loại
   - Giảm độ phức tạp, dễ maintain

3. **Ưu tiên:**
   - Tập trung vào **Projects** và **AboutSection** trước
   - Đây là 2 phần quan trọng nhất của website giới thiệu công ty xây dựng

4. **Mở rộng sau:**
   - Nếu sau này cần phân loại phức tạp hơn, có thể thêm lại các bảng category
   - Hiện tại giữ đơn giản để dễ triển khai và maintain

---

## 🎯 Mapping Với Website romanproperty.vn

| Trang Website | Bảng DB Tương Ứng |
|--------------|-------------------|
| Trang chủ | `banners`, `projects` (featured), `posts` (featured) |
| Giới thiệu | `about_sections` |
| Dự án trọng điểm | `projects` |
| Tin tức | `posts`, `postcategory`, `posttag` |
| Liên hệ | `contacts` |
| (Ẩn) Đội ngũ | `staff` |
| (Ẩn) Đối tác | `partners` |
| (Ẩn) Thư viện | `gallery` |
| (Ẩn) Chứng chỉ | `certificates` |
| (Ẩn) FAQ | `faqs` |
