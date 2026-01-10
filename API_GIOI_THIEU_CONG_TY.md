# API Tích Hợp - Phần Giới Thiệu Công Ty

Tài liệu này mô tả chi tiết các API endpoints cho phần "Giới thiệu công ty", bao gồm 8 modules: Projects, About Sections, Staff, Testimonials, Partners, Gallery, Certificates, và FAQs.

---

## 📋 Mục Lục

1. [Projects (Dự án)](#1-projects-dự-án)
2. [About Sections (Giới thiệu)](#2-about-sections-giới-thiệu)
3. [Staff (Nhân viên)](#3-staff-nhân-viên)
4. [Testimonials (Lời chứng thực)](#4-testimonials-lời-chứng-thực)
5. [Partners (Đối tác)](#5-partners-đối-tác)
6. [Gallery (Thư viện ảnh)](#6-gallery-thư-viện-ảnh)
7. [Certificates (Chứng chỉ)](#7-certificates-chứng-chỉ)
8. [FAQs (Câu hỏi thường gặp)](#8-faqs-câu-hỏi-thường-gặp)
9. [Enums & Constants](#9-enums--constants)

---

## 🔑 Quy Ước

- **Base URL**: `http://your-api-domain.com/api`
- **Public APIs**: Không cần authentication
- **Admin APIs**: Cần JWT token trong header `Authorization: Bearer <token>`
- **Trường tự động**: Các trường được đánh dấu ⚙️ là do API tự sinh, FE không cần gửi
- **Trường bắt buộc**: Được đánh dấu ✅
- **Trường tùy chọn**: Được đánh dấu ⭕

---

## 1. Projects (Dự án)

### 1.1. Public APIs

#### GET `/projects`
Lấy danh sách dự án (có phân trang, filter, sort)

**Query Parameters:**
- `page`: Số trang (mặc định: 1)
- `limit`: Số item/trang (mặc định: 10)
- `status`: Lọc theo trạng thái (`planning`, `in_progress`, `completed`, `cancelled`)
- `featured`: Lọc dự án nổi bật (`true`/`false`)
- `search`: Tìm kiếm theo tên
- `sort`: Sắp xếp (`created_at`, `sort_order`, `name`)
- `order`: Thứ tự (`asc`/`desc`)

**Response:**
```json
{
  "data": [
    {
      "id": "1",
      "name": "Dự án ABC",
      "slug": "du-an-abc", // ⚙️ Tự động tạo từ name nếu không gửi
      "description": "Mô tả dự án...",
      "short_description": "Mô tả ngắn...",
      "cover_image": "https://...",
      "location": "Hà Nội",
      "area": 1000.50,
      "start_date": "2024-01-01T00:00:00.000Z",
      "end_date": "2024-12-31T00:00:00.000Z",
      "status": "in_progress",
      "client_name": "Công ty XYZ",
      "budget": 5000000000,
      "images": ["url1", "url2"], // Array of image URLs
      "featured": true,
      "view_count": 150, // ⚙️ Tự động tăng khi xem
      "sort_order": 0,
      "meta_title": "SEO Title",
      "meta_description": "SEO Description",
      "canonical_url": "https://...",
      "og_image": "https://...",
      "created_at": "2024-01-01T00:00:00.000Z", // ⚙️ Tự động
      "updated_at": "2024-01-01T00:00:00.000Z", // ⚙️ Tự động
      "testimonials": [] // Quan hệ với testimonials
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

#### GET `/projects/featured`
Lấy danh sách dự án nổi bật

**Query Parameters:**
- `limit`: Số lượng (mặc định: 10)

#### GET `/projects/:slug`
Lấy chi tiết dự án theo slug

**Response:** Giống như item trong danh sách

---

### 1.2. Admin APIs

#### POST `/admin/projects`
Tạo dự án mới

**Request Body:**
```json
{
  "name": "Dự án ABC", // ✅ Bắt buộc
  "slug": "du-an-abc", // ⭕ Tùy chọn - Nếu không gửi, API tự tạo từ name
  "description": "Mô tả chi tiết...", // ⭕
  "short_description": "Mô tả ngắn...", // ⭕
  "cover_image": "https://...", // ⭕
  "location": "Hà Nội", // ⭕
  "area": 1000.50, // ⭕
  "start_date": "2024-01-01", // ⭕ Format: YYYY-MM-DD hoặc ISO string
  "end_date": "2024-12-31", // ⭕
  "status": "planning", // ⭕ Mặc định: "planning"
  "client_name": "Công ty XYZ", // ⭕
  "budget": 5000000000, // ⭕
  "images": ["url1", "url2"], // ⭕ Array of image URLs
  "featured": false, // ⭕ Mặc định: false
  "sort_order": 0, // ⭕ Mặc định: 0
  "meta_title": "SEO Title", // ⭕
  "meta_description": "SEO Description", // ⭕
  "canonical_url": "https://...", // ⭕
  "og_image": "https://..." // ⭕
}
```

**Trường API tự sinh (không cần gửi):**
- ⚙️ `id`: Tự động tạo
- ⚙️ `slug`: Tự động tạo từ `name` nếu không gửi
- ⚙️ `view_count`: Mặc định 0
- ⚙️ `created_at`: Thời gian tạo
- ⚙️ `updated_at`: Thời gian cập nhật
- ⚙️ `created_user_id`: Từ JWT token
- ⚙️ `updated_user_id`: Từ JWT token

#### GET `/admin/projects`
Lấy danh sách dự án (admin) - Tương tự public API nhưng có thể lọc cả dự án đã xóa

#### GET `/admin/projects/:id`
Lấy chi tiết dự án theo ID

#### PUT `/admin/projects/:id`
Cập nhật dự án

**Request Body:** Tương tự POST, nhưng tất cả trường đều tùy chọn

#### DELETE `/admin/projects/:id`
Xóa mềm dự án (soft delete)

#### PATCH `/admin/projects/:id/status`
Thay đổi trạng thái dự án

**Request Body:**
```json
{
  "status": "in_progress" // ✅ "planning" | "in_progress" | "completed" | "cancelled"
}
```

#### PATCH `/admin/projects/:id/featured`
Bật/tắt nổi bật

**Request Body:**
```json
{
  "featured": true // ✅ boolean
}
```

#### PATCH `/admin/projects/:id/sort-order`
Cập nhật thứ tự sắp xếp

**Request Body:**
```json
{
  "sort_order": 10 // ✅ number
}
```

---

## 2. About Sections (Giới thiệu)

### 2.1. Public APIs

#### GET `/about-sections`
Lấy danh sách các section giới thiệu

**Query Parameters:**
- `page`, `limit`, `search`, `sort`, `order`: Tương tự Projects
- `section_type`: Lọc theo loại (`history`, `mission`, `vision`, `values`, `culture`, `achievement`, `other`)
- `status`: Lọc theo trạng thái (`active`/`inactive`)

**Response:**
```json
{
  "data": [
    {
      "id": "1",
      "title": "Lịch sử công ty",
      "slug": "lich-su-cong-ty", // ⚙️ Tự động tạo
      "content": "Nội dung HTML...",
      "image": "https://...",
      "video_url": "https://...",
      "section_type": "history",
      "status": "active",
      "sort_order": 0,
      "created_at": "2024-01-01T00:00:00.000Z", // ⚙️
      "updated_at": "2024-01-01T00:00:00.000Z" // ⚙️
    }
  ],
  "meta": { ... }
}
```

#### GET `/about-sections/type/:type`
Lấy các section theo loại

**Path Parameters:**
- `type`: `history` | `mission` | `vision` | `values` | `culture` | `achievement` | `other`

#### GET `/about-sections/:slug`
Lấy chi tiết section theo slug

---

### 2.2. Admin APIs

#### POST `/admin/about-sections`
Tạo section mới

**Request Body:**
```json
{
  "title": "Lịch sử công ty", // ✅ Bắt buộc
  "slug": "lich-su-cong-ty", // ⭕ Tự động tạo từ title nếu không gửi
  "content": "Nội dung HTML...", // ✅ Bắt buộc
  "image": "https://...", // ⭕
  "video_url": "https://...", // ⭕
  "section_type": "history", // ⭕ Mặc định: "history"
  "status": "active", // ⭕ Mặc định: "active"
  "sort_order": 0 // ⭕ Mặc định: 0
}
```

**Trường API tự sinh:**
- ⚙️ `id`, `slug` (nếu không gửi), `created_at`, `updated_at`, `created_user_id`, `updated_user_id`

#### GET `/admin/about-sections`
Lấy danh sách (admin)

#### GET `/admin/about-sections/:id`
Lấy chi tiết

#### PUT `/admin/about-sections/:id`
Cập nhật

#### DELETE `/admin/about-sections/:id`
Xóa mềm

---

## 3. Staff (Nhân viên)

### 3.1. Public APIs

#### GET `/staff`
Lấy danh sách nhân viên

**Query Parameters:**
- `page`, `limit`, `search`, `sort`, `order`: Tương tự
- `department`: Lọc theo phòng ban
- `status`: `active`/`inactive`

**Response:**
```json
{
  "data": [
    {
      "id": "1",
      "name": "Nguyễn Văn A",
      "position": "Giám đốc",
      "department": "Ban Giám đốc",
      "bio": "Tiểu sử...",
      "avatar": "https://...",
      "email": "a@example.com",
      "phone": "0123456789",
      "social_links": { // ⚙️ JSON object
        "facebook": "https://...",
        "linkedin": "https://..."
      },
      "experience": 10, // Số năm kinh nghiệm
      "expertise": "Quản lý, Kinh doanh",
      "status": "active",
      "sort_order": 0,
      "created_at": "2024-01-01T00:00:00.000Z", // ⚙️
      "updated_at": "2024-01-01T00:00:00.000Z" // ⚙️
    }
  ],
  "meta": { ... }
}
```

#### GET `/staff/department/:department`
Lấy nhân viên theo phòng ban

#### GET `/staff/:id`
Lấy chi tiết nhân viên

---

### 3.2. Admin APIs

#### POST `/admin/staff`
Tạo nhân viên mới

**Request Body:**
```json
{
  "name": "Nguyễn Văn A", // ✅ Bắt buộc
  "position": "Giám đốc", // ✅ Bắt buộc
  "department": "Ban Giám đốc", // ⭕
  "bio": "Tiểu sử...", // ⭕
  "avatar": "https://...", // ⭕
  "email": "a@example.com", // ⭕
  "phone": "0123456789", // ⭕
  "social_links": { // ⭕ JSON object
    "facebook": "https://...",
    "linkedin": "https://..."
  },
  "experience": 10, // ⭕ Số năm
  "expertise": "Quản lý, Kinh doanh", // ⭕
  "status": "active", // ⭕ Mặc định: "active"
  "sort_order": 0 // ⭕ Mặc định: 0
}
```

**Trường API tự sinh:**
- ⚙️ `id`, `created_at`, `updated_at`, `created_user_id`, `updated_user_id`

#### GET `/admin/staff`
Lấy danh sách (admin)

#### GET `/admin/staff/:id`
Lấy chi tiết

#### PUT `/admin/staff/:id`
Cập nhật

#### DELETE `/admin/staff/:id`
Xóa mềm

---

## 4. Testimonials (Lời chứng thực)

### 4.1. Public APIs

#### GET `/testimonials`
Lấy danh sách lời chứng thực

**Query Parameters:**
- `page`, `limit`, `search`, `sort`, `order`: Tương tự
- `project_id`: Lọc theo dự án
- `featured`: Lọc nổi bật
- `status`: `active`/`inactive`

**Response:**
```json
{
  "data": [
    {
      "id": "1",
      "client_name": "Nguyễn Văn B",
      "client_position": "CEO",
      "client_company": "Công ty ABC",
      "client_avatar": "https://...",
      "content": "Lời chứng thực...",
      "rating": 5, // 1-5 sao
      "project_id": 1, // ID dự án liên quan
      "project": { // Quan hệ với Project
        "id": "1",
        "name": "Dự án ABC",
        "slug": "du-an-abc"
      },
      "featured": true,
      "status": "active",
      "sort_order": 0,
      "created_at": "2024-01-01T00:00:00.000Z", // ⚙️
      "updated_at": "2024-01-01T00:00:00.000Z" // ⚙️
    }
  ],
  "meta": { ... }
}
```

#### GET `/testimonials/featured`
Lấy lời chứng thực nổi bật

**Query Parameters:**
- `limit`: Số lượng (mặc định: 10)

#### GET `/testimonials/project/:projectId`
Lấy lời chứng thực theo dự án

---

### 4.2. Admin APIs

#### POST `/admin/testimonials`
Tạo lời chứng thực mới

**Request Body:**
```json
{
  "client_name": "Nguyễn Văn B", // ✅ Bắt buộc
  "client_position": "CEO", // ⭕
  "client_company": "Công ty ABC", // ⭕
  "client_avatar": "https://...", // ⭕
  "content": "Lời chứng thực...", // ✅ Bắt buộc
  "rating": 5, // ⭕ 1-5, mặc định: null
  "project_id": 1, // ⭕ ID dự án liên quan
  "featured": false, // ⭕ Mặc định: false
  "status": "active", // ⭕ Mặc định: "active"
  "sort_order": 0 // ⭕ Mặc định: 0
}
```

**Trường API tự sinh:**
- ⚙️ `id`, `created_at`, `updated_at`, `created_user_id`, `updated_user_id`

#### GET `/admin/testimonials`
Lấy danh sách (admin)

#### GET `/admin/testimonials/:id`
Lấy chi tiết

#### PUT `/admin/testimonials/:id`
Cập nhật

#### DELETE `/admin/testimonials/:id`
Xóa mềm

#### PATCH `/admin/testimonials/:id/featured`
Bật/tắt nổi bật

**Request Body:**
```json
{
  "featured": true // ✅ boolean
}
```

---

## 5. Partners (Đối tác)

### 5.1. Public APIs

#### GET `/partners`
Lấy danh sách đối tác

**Query Parameters:**
- `page`, `limit`, `search`, `sort`, `order`: Tương tự
- `type`: Lọc theo loại (`client`, `supplier`, `partner`)
- `status`: `active`/`inactive`

**Response:**
```json
{
  "data": [
    {
      "id": "1",
      "name": "Công ty ABC",
      "logo": "https://...",
      "website": "https://abc.com",
      "description": "Mô tả...",
      "type": "client",
      "status": "active",
      "sort_order": 0,
      "created_at": "2024-01-01T00:00:00.000Z", // ⚙️
      "updated_at": "2024-01-01T00:00:00.000Z" // ⚙️
    }
  ],
  "meta": { ... }
}
```

#### GET `/partners/type/:type`
Lấy đối tác theo loại

**Path Parameters:**
- `type`: `client` | `supplier` | `partner`

---

### 5.2. Admin APIs

#### POST `/admin/partners`
Tạo đối tác mới

**Request Body:**
```json
{
  "name": "Công ty ABC", // ✅ Bắt buộc
  "logo": "https://...", // ✅ Bắt buộc
  "website": "https://abc.com", // ⭕ Phải là URL hợp lệ
  "description": "Mô tả...", // ⭕
  "type": "client", // ⭕ Mặc định: "client"
  "status": "active", // ⭕ Mặc định: "active"
  "sort_order": 0 // ⭕ Mặc định: 0
}
```

**Trường API tự sinh:**
- ⚙️ `id`, `created_at`, `updated_at`, `created_user_id`, `updated_user_id`

#### GET `/admin/partners`
Lấy danh sách (admin)

#### GET `/admin/partners/:id`
Lấy chi tiết

#### PUT `/admin/partners/:id`
Cập nhật

#### DELETE `/admin/partners/:id`
Xóa mềm

---

## 6. Gallery (Thư viện ảnh)

### 6.1. Public APIs

#### GET `/gallery`
Lấy danh sách gallery

**Query Parameters:**
- `page`, `limit`, `search`, `sort`, `order`: Tương tự
- `featured`: Lọc nổi bật
- `status`: `active`/`inactive`

**Response:**
```json
{
  "data": [
    {
      "id": "1",
      "title": "Sự kiện ABC",
      "slug": "su-kien-abc", // ⚙️ Tự động tạo
      "description": "Mô tả...",
      "cover_image": "https://...",
      "images": ["url1", "url2", "url3"], // ✅ Array of image URLs
      "featured": true,
      "status": "active",
      "sort_order": 0,
      "created_at": "2024-01-01T00:00:00.000Z", // ⚙️
      "updated_at": "2024-01-01T00:00:00.000Z" // ⚙️
    }
  ],
  "meta": { ... }
}
```

#### GET `/gallery/featured`
Lấy gallery nổi bật

**Query Parameters:**
- `limit`: Số lượng (mặc định: 10)

#### GET `/gallery/:slug`
Lấy chi tiết gallery theo slug

---

### 6.2. Admin APIs

#### POST `/admin/gallery`
Tạo gallery mới

**Request Body:**
```json
{
  "title": "Sự kiện ABC", // ✅ Bắt buộc
  "slug": "su-kien-abc", // ⭕ Tự động tạo từ title nếu không gửi
  "description": "Mô tả...", // ⭕
  "cover_image": "https://...", // ⭕
  "images": ["url1", "url2", "url3"], // ✅ Bắt buộc - Array of image URLs
  "featured": false, // ⭕ Mặc định: false
  "status": "active", // ⭕ Mặc định: "active"
  "sort_order": 0 // ⭕ Mặc định: 0
}
```

**Trường API tự sinh:**
- ⚙️ `id`, `slug` (nếu không gửi), `created_at`, `updated_at`, `created_user_id`, `updated_user_id`

#### GET `/admin/gallery`
Lấy danh sách (admin)

#### GET `/admin/gallery/:id`
Lấy chi tiết

#### PUT `/admin/gallery/:id`
Cập nhật

#### DELETE `/admin/gallery/:id`
Xóa mềm

---

## 7. Certificates (Chứng chỉ)

### 7.1. Public APIs

#### GET `/certificates`
Lấy danh sách chứng chỉ

**Query Parameters:**
- `page`, `limit`, `search`, `sort`, `order`: Tương tự
- `type`: Lọc theo loại (`iso`, `award`, `license`, `certification`, `other`)
- `status`: `active`/`inactive`

**Response:**
```json
{
  "data": [
    {
      "id": "1",
      "name": "ISO 9001:2015",
      "image": "https://...",
      "issued_by": "Tổ chức ABC",
      "issued_date": "2024-01-01T00:00:00.000Z",
      "expiry_date": "2027-01-01T00:00:00.000Z",
      "certificate_number": "ISO-2024-001",
      "description": "Mô tả...",
      "type": "iso",
      "status": "active",
      "sort_order": 0,
      "created_at": "2024-01-01T00:00:00.000Z", // ⚙️
      "updated_at": "2024-01-01T00:00:00.000Z" // ⚙️
    }
  ],
  "meta": { ... }
}
```

#### GET `/certificates/type/:type`
Lấy chứng chỉ theo loại

**Path Parameters:**
- `type`: `iso` | `award` | `license` | `certification` | `other`

---

### 7.2. Admin APIs

#### POST `/admin/certificates`
Tạo chứng chỉ mới

**Request Body:**
```json
{
  "name": "ISO 9001:2015", // ✅ Bắt buộc
  "image": "https://...", // ✅ Bắt buộc
  "issued_by": "Tổ chức ABC", // ⭕
  "issued_date": "2024-01-01", // ⭕ Format: YYYY-MM-DD hoặc ISO string
  "expiry_date": "2027-01-01", // ⭕
  "certificate_number": "ISO-2024-001", // ⭕
  "description": "Mô tả...", // ⭕
  "type": "iso", // ⭕ Mặc định: "license"
  "status": "active", // ⭕ Mặc định: "active"
  "sort_order": 0 // ⭕ Mặc định: 0
}
```

**Trường API tự sinh:**
- ⚙️ `id`, `created_at`, `updated_at`, `created_user_id`, `updated_user_id`

#### GET `/admin/certificates`
Lấy danh sách (admin)

#### GET `/admin/certificates/:id`
Lấy chi tiết

#### PUT `/admin/certificates/:id`
Cập nhật

#### DELETE `/admin/certificates/:id`
Xóa mềm

---

## 8. FAQs (Câu hỏi thường gặp)

### 8.1. Public APIs

#### GET `/faqs`
Lấy danh sách câu hỏi thường gặp

**Query Parameters:**
- `page`, `limit`, `search`, `sort`, `order`: Tương tự
- `status`: `active`/`inactive`

**Response:**
```json
{
  "data": [
    {
      "id": "1",
      "question": "Câu hỏi?",
      "answer": "Câu trả lời...",
      "view_count": 150, // ⚙️ Tự động tăng khi xem
      "helpful_count": 20, // ⚙️ Tự động tăng khi user đánh dấu helpful
      "status": "active",
      "sort_order": 0,
      "created_at": "2024-01-01T00:00:00.000Z", // ⚙️
      "updated_at": "2024-01-01T00:00:00.000Z" // ⚙️
    }
  ],
  "meta": { ... }
}
```

#### GET `/faqs/popular`
Lấy câu hỏi phổ biến (sắp xếp theo view_count)

**Query Parameters:**
- `limit`: Số lượng (mặc định: 10)

#### GET `/faqs/:id`
Lấy chi tiết câu hỏi (tự động tăng view_count)

#### POST `/faqs/:id/helpful`
Đánh dấu câu hỏi là hữu ích (tăng helpful_count)

**Response:**
```json
{
  "id": "1",
  "helpful_count": 21 // Đã tăng lên
}
```

---

### 8.2. Admin APIs

#### POST `/admin/faqs`
Tạo câu hỏi mới

**Request Body:**
```json
{
  "question": "Câu hỏi?", // ✅ Bắt buộc
  "answer": "Câu trả lời...", // ✅ Bắt buộc
  "status": "active", // ⭕ Mặc định: "active"
  "sort_order": 0 // ⭕ Mặc định: 0
}
```

**Trường API tự sinh:**
- ⚙️ `id`, `view_count` (mặc định: 0), `helpful_count` (mặc định: 0), `created_at`, `updated_at`, `created_user_id`, `updated_user_id`

#### GET `/admin/faqs`
Lấy danh sách (admin)

#### GET `/admin/faqs/:id`
Lấy chi tiết

#### PUT `/admin/faqs/:id`
Cập nhật

#### DELETE `/admin/faqs/:id`
Xóa mềm

---

## 9. Enums & Constants

### 9.1. ProjectStatus
```typescript
enum ProjectStatus {
  planning = "planning",      // Đang lên kế hoạch
  in_progress = "in_progress", // Đang thực hiện
  completed = "completed",     // Hoàn thành
  cancelled = "cancelled"       // Đã hủy
}
```

### 9.2. AboutSectionType
```typescript
enum AboutSectionType {
  history = "history",         // Lịch sử
  mission = "mission",         // Sứ mệnh
  vision = "vision",           // Tầm nhìn
  values = "values",           // Giá trị cốt lõi
  culture = "culture",         // Văn hóa
  achievement = "achievement",  // Thành tựu
  other = "other"              // Khác
}
```

### 9.3. PartnerType
```typescript
enum PartnerType {
  client = "client",       // Khách hàng
  supplier = "supplier",    // Nhà cung cấp
  partner = "partner"       // Đối tác
}
```

### 9.4. CertificateType
```typescript
enum CertificateType {
  iso = "iso",                    // ISO
  award = "award",                 // Giải thưởng
  license = "license",             // Giấy phép
  certification = "certification", // Chứng nhận
  other = "other"                  // Khác
}
```

### 9.5. BasicStatus
```typescript
enum BasicStatus {
  active = "active",     // Hoạt động
  inactive = "inactive"  // Không hoạt động
}
```

---

## 📝 Lưu Ý Quan Trọng

### 1. Slug Tự Động
- Các trường `slug` sẽ được API tự động tạo từ `name`/`title` nếu FE không gửi
- Slug được chuẩn hóa (chuyển thành lowercase, thay khoảng trắng bằng dấu gạch ngang, loại bỏ ký tự đặc biệt)
- Nếu slug đã tồn tại, API tự động thêm số đếm phía sau (ví dụ: `du-an-abc-1`, `du-an-abc-2`)

### 2. Trường Tự Động (Không Cần Gửi)
- `id`: Tự động tạo
- `created_at`, `updated_at`: Tự động cập nhật
- `created_user_id`, `updated_user_id`: Lấy từ JWT token
- `view_count`, `helpful_count`: Tự động tăng khi có hành động tương ứng
- `slug`: Tự động tạo nếu không gửi

### 3. Format Dữ Liệu
- **Date**: Format ISO 8601 (`YYYY-MM-DD` hoặc `YYYY-MM-DDTHH:mm:ss.sssZ`)
- **Decimal/Number**: Gửi dạng số (không phải string)
- **JSON**: Gửi dạng object/array (không phải string JSON)
- **Images**: Array of URLs (strings)

### 4. Phân Trang
Tất cả API list đều hỗ trợ phân trang:
- `page`: Số trang (bắt đầu từ 1)
- `limit`: Số item/trang
- Response có `meta` object chứa thông tin phân trang

### 5. Filter & Sort
- `search`: Tìm kiếm (thường tìm trong các trường text chính)
- `sort`: Trường sắp xếp
- `order`: `asc` hoặc `desc`

### 6. Soft Delete
- DELETE API chỉ đánh dấu xóa mềm (set `deleted_at`)
- Public APIs tự động lọc các bản ghi đã xóa
- Admin APIs có thể lọc cả bản ghi đã xóa (tùy query parameter)

### 7. Authentication
- **Public APIs**: Không cần token
- **Admin APIs**: Cần JWT token trong header:
  ```
  Authorization: Bearer <your-jwt-token>
  ```

### 8. Error Response
Khi có lỗi, API trả về:
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "name should not be empty"
    }
  ]
}
```

---

## 🔗 Tổng Kết Endpoints

### Public Endpoints
- `GET /projects` - Danh sách dự án
- `GET /projects/featured` - Dự án nổi bật
- `GET /projects/:slug` - Chi tiết dự án
- `GET /about-sections` - Danh sách giới thiệu
- `GET /about-sections/type/:type` - Giới thiệu theo loại
- `GET /about-sections/:slug` - Chi tiết giới thiệu
- `GET /staff` - Danh sách nhân viên
- `GET /staff/department/:department` - Nhân viên theo phòng ban
- `GET /staff/:id` - Chi tiết nhân viên
- `GET /testimonials` - Danh sách lời chứng thực
- `GET /testimonials/featured` - Lời chứng thực nổi bật
- `GET /testimonials/project/:projectId` - Lời chứng thực theo dự án
- `GET /partners` - Danh sách đối tác
- `GET /partners/type/:type` - Đối tác theo loại
- `GET /gallery` - Danh sách gallery
- `GET /gallery/featured` - Gallery nổi bật
- `GET /gallery/:slug` - Chi tiết gallery
- `GET /certificates` - Danh sách chứng chỉ
- `GET /certificates/type/:type` - Chứng chỉ theo loại
- `GET /faqs` - Danh sách FAQs
- `GET /faqs/popular` - FAQs phổ biến
- `GET /faqs/:id` - Chi tiết FAQ
- `POST /faqs/:id/helpful` - Đánh dấu helpful

### Admin Endpoints
- `POST /admin/projects` - Tạo dự án
- `GET /admin/projects` - Danh sách dự án
- `GET /admin/projects/:id` - Chi tiết dự án
- `PUT /admin/projects/:id` - Cập nhật dự án
- `DELETE /admin/projects/:id` - Xóa dự án
- `PATCH /admin/projects/:id/status` - Đổi trạng thái
- `PATCH /admin/projects/:id/featured` - Bật/tắt nổi bật
- `PATCH /admin/projects/:id/sort-order` - Cập nhật thứ tự
- *(Tương tự cho các modules khác: about-sections, staff, testimonials, partners, gallery, certificates, faqs)*

---

**Chúc các bạn tích hợp thành công! 🚀**

