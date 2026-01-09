# Đề Xuất Phát Triển Web Giới Thiệu Công Ty Xây Dựng

## 📊 Các Bảng Hiện Có (Có Thể Tái Sử Dụng)

- ✅ `banners`, `banner_locations` - Quản lý banner
- ✅ `posts`, `postcategory`, `posttag` - Blog/Tin tức
- ✅ `contacts` - Form liên hệ
- ✅ `general_configs` - Cấu hình chung
- ✅ `users`, `profiles` - Quản lý user
- ✅ `menus` - Menu hệ thống
- ✅ `notifications` - Thông báo

## ➕ Các Bảng Cần Thêm Cho Web Giới Thiệu Công Ty Xây Dựng

### 1. Projects (Dự án) - **QUAN TRỌNG**
```prisma
model Project {
  id              BigInt      @id
  name            String      // Tên dự án
  slug            String      @unique
  description     String?     @db.Text
  short_description String?   @db.VarChar(500)
  cover_image     String?
  location        String?     // Địa điểm
  area            Decimal?    // Diện tích (m²)
  start_date      DateTime?
  end_date        DateTime?
  status          ProjectStatus // planning, in_progress, completed, cancelled
  category_id     BigInt?     // Loại dự án (nhà ở, công trình công cộng, v.v.)
  client_name     String?     // Tên chủ đầu tư
  budget          Decimal?    // Ngân sách
  images          Json?       // Mảng ảnh dự án
  featured        Boolean     @default(false)
  view_count      BigInt      @default(0)
  sort_order      Int         @default(0)
  meta_title      String?
  meta_description String?    @db.Text
  created_at      DateTime    @default(now())
  updated_at      DateTime    @updatedAt
  deleted_at      DateTime?
}

enum ProjectStatus {
  planning
  in_progress
  completed
  cancelled
}
```

### 2. ProjectCategories (Danh mục dự án)
```prisma
model ProjectCategory {
  id          BigInt    @id
  name        String
  slug        String    @unique
  description String?   @db.Text
  image       String?
  sort_order  Int       @default(0)
  status      BasicStatus
  projects    Project[]
}
```

### 3. Services (Dịch vụ)
```prisma
model Service {
  id              BigInt      @id
  name            String
  slug            String      @unique
  description     String?     @db.Text
  short_description String?  @db.VarChar(500)
  icon            String?     // Icon hoặc ảnh đại diện
  image           String?
  content         String?     @db.LongText // Nội dung chi tiết
  features        Json?       // Danh sách tính năng
  price_range     String?     // Khoảng giá (nếu có)
  status          BasicStatus
  sort_order      Int         @default(0)
  meta_title      String?
  meta_description String?   @db.Text
  created_at      DateTime    @default(now())
  updated_at      DateTime    @updatedAt
  deleted_at      DateTime?
}
```

### 4. Team/Staff (Đội ngũ nhân viên)
```prisma
model TeamMember {
  id              BigInt      @id
  name            String
  position        String      // Chức vụ
  department      String?     // Phòng ban
  bio             String?     @db.Text
  avatar          String?
  email           String?
  phone           String?
  social_links    Json?       // Facebook, LinkedIn, v.v.
  experience      Int?        // Số năm kinh nghiệm
  expertise       String?     @db.Text // Chuyên môn
  status          BasicStatus
  sort_order      Int         @default(0)
  created_at      DateTime    @default(now())
  updated_at      DateTime    @updatedAt
  deleted_at      DateTime?
}
```

### 5. Testimonials (Lời chứng thực/Khách hàng nói gì)
```prisma
model Testimonial {
  id              BigInt      @id
  client_name     String
  client_position String?     // Chức vụ khách hàng
  client_company  String?     // Công ty khách hàng
  client_avatar   String?
  content         String      @db.Text
  rating          Int?        // 1-5 sao
  project_id      BigInt?     // Liên kết với dự án (nếu có)
  featured        Boolean     @default(false)
  status          BasicStatus
  sort_order      Int         @default(0)
  created_at      DateTime    @default(now())
  updated_at      DateTime    @updatedAt
  deleted_at      DateTime?
}
```

### 6. Gallery (Thư viện ảnh)
```prisma
model Gallery {
  id              BigInt      @id
  title           String
  slug            String      @unique
  description     String?     @db.Text
  cover_image     String?
  category_id     BigInt?     // Phân loại ảnh
  images          Json        // Mảng ảnh
  featured        Boolean     @default(false)
  status          BasicStatus
  sort_order      Int         @default(0)
  created_at      DateTime    @default(now())
  updated_at      DateTime    @updatedAt
  deleted_at      DateTime?
}

model GalleryCategory {
  id          BigInt    @id
  name        String
  slug        String    @unique
  description String?   @db.Text
  galleries   Gallery[]
}
```

### 7. Partners/Clients (Đối tác/Khách hàng)
```prisma
model Partner {
  id              BigInt      @id
  name            String
  logo            String
  website         String?
  description     String?     @db.Text
  type            PartnerType // client, supplier, partner
  status          BasicStatus
  sort_order      Int         @default(0)
  created_at      DateTime    @default(now())
  updated_at      DateTime    @updatedAt
  deleted_at      DateTime?
}

enum PartnerType {
  client
  supplier
  partner
}
```

### 8. Certificates/Awards (Chứng chỉ/Giải thưởng)
```prisma
model Certificate {
  id              BigInt      @id
  name            String
  image           String
  issued_by       String?     // Cấp bởi
  issued_date     DateTime?
  expiry_date     DateTime?
  certificate_number String?  // Số chứng chỉ
  description     String?     @db.Text
  type            CertificateType // iso, award, license, v.v.
  status          BasicStatus
  sort_order      Int         @default(0)
  created_at      DateTime    @default(now())
  updated_at      DateTime    @updatedAt
  deleted_at      DateTime?
}

enum CertificateType {
  iso
  award
  license
  certification
  other
}
```

### 9. About (Giới thiệu công ty)
```prisma
model AboutSection {
  id              BigInt      @id
  title           String
  slug            String      @unique
  content         String      @db.LongText
  image           String?
  video_url       String?
  section_type    AboutSectionType // history, mission, vision, values, v.v.
  status          BasicStatus
  sort_order      Int         @default(0)
  created_at      DateTime    @default(now())
  updated_at      DateTime    @updatedAt
  deleted_at      DateTime?
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

### 10. FAQs (Câu hỏi thường gặp)
```prisma
model Faq {
  id              BigInt      @id
  question        String      @db.Text
  answer          String      @db.LongText
  category_id     BigInt?     // Phân loại câu hỏi
  view_count      BigInt      @default(0)
  helpful_count   BigInt      @default(0)
  status          BasicStatus
  sort_order      Int         @default(0)
  created_at      DateTime    @default(now())
  updated_at      DateTime    @updatedAt
  deleted_at      DateTime?
}

model FaqCategory {
  id          BigInt    @id
  name        String
  slug        String    @unique
  description String?   @db.Text
  faqs        Faq[]
}
```

### 11. Statistics (Thống kê/Số liệu)
```prisma
model Statistic {
  id              BigInt      @id
  label           String      // "Dự án hoàn thành"
  value           String      // "500+"
  icon            String?     // Icon
  unit            String?     // "+", "%", v.v.
  description     String?     @db.Text
  status          BasicStatus
  sort_order      Int         @default(0)
  created_at      DateTime    @default(now())
  updated_at      DateTime    @updatedAt
  deleted_at      DateTime?
}
```

## 📋 Ưu Tiên Triển Khai

### Phase 1 (Bắt buộc)
1. ✅ **Projects** - Quản lý dự án
2. ✅ **ProjectCategories** - Phân loại dự án
3. ✅ **Services** - Dịch vụ công ty
4. ✅ **About** - Giới thiệu công ty

### Phase 2 (Quan trọng)
5. ✅ **Team/Staff** - Đội ngũ nhân viên
6. ✅ **Testimonials** - Lời chứng thực
7. ✅ **Partners** - Đối tác/Khách hàng
8. ✅ **Gallery** - Thư viện ảnh

### Phase 3 (Bổ sung)
9. ✅ **Certificates** - Chứng chỉ/Giải thưởng
10. ✅ **FAQs** - Câu hỏi thường gặp
11. ✅ **Statistics** - Thống kê/Số liệu

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

## 📝 Ghi Chú

- Các bảng `posts`, `banners`, `contacts` đã có sẵn, có thể tái sử dụng
- Ưu tiên tạo module **Projects** và **Services** trước vì đây là core của web giới thiệu công ty xây dựng
- Có thể tận dụng `Post` model cho phần "Tin tức" hoặc "Dự án nổi bật"

