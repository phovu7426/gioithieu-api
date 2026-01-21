# Cấu Trúc Module Mới - Tóm Tắt Nhanh

## 📁 Tổng Quan Cấu Trúc

```
src/modules/
├── core/           → Nền tảng kỹ thuật (Auth, IAM, RBAC, Context, Menu, Notification, System Config)
├── storage/        → Lưu trữ (File Upload)
├── introduction/   → Nghiệp vụ giới thiệu (Homepage, About, Contact, FAQ, Project, Partner, Staff, Testimonial, Certificate, Gallery)
├── post/           → Nghiệp vụ tin tức/blog (Post, Category, Tag, Comment, Cron)
└── marketing/      → Nghiệp vụ marketing (Banner)
```

## 🎯 Nguyên Tắc Phân Nhóm

### 1. **Core** (Platform/Infrastructure)
Các module kỹ thuật, tái sử dụng cao, không liên quan đến nghiệp vụ cụ thể:
- `auth` - Xác thực (JWT, Login, Register, Google OAuth)
- `iam` - Identity & Access Management (User, Profile) - *Đổi tên từ user-management*
- `rbac` - Role-Based Access Control
- `context` - Request/Response Context Management
- `menu` - Menu Management (Header/Footer)
- `notification` - Notification System
- `system-config` - Dynamic System Configuration

### 2. **Storage** (Platform/Infrastructure)
Các module liên quan đến lưu trữ dữ liệu:
- `file-upload` - File Upload & Management

### 3. **Introduction** (Business Domain)
Các module phục vụ giới thiệu doanh nghiệp:
- `homepage` - Trang chủ (Dashboard API)
- `about` - Về chúng tôi
- `contact` - Liên hệ & Phản hồi
- `faq` - Câu hỏi thường gặp
- `project` - Dự án/Portfolio
- `partner` - Đối tác/Khách hàng
- `staff` - Nhân sự/Team
- `testimonial` - Đánh giá từ khách hàng
- `certificate` - Chứng chỉ/Giải thưởng
- `gallery` - Thư viện ảnh

### 4. **Post** (Business Domain)
Các module phục vụ tin tức/blog:
- `admin/post` - Quản lý bài viết
- `admin/post-category` - Danh mục
- `admin/post-tag` - Thẻ
- `admin/comment` - Bình luận
- `public/*` - Public APIs
- `cron` - Background jobs (View counter sync)
- `repositories` - Data access layer

### 5. **Marketing** (Business Domain)
Các module phục vụ marketing:
- `banner` - Banner/Slider quảng cáo

## 📐 Cấu Trúc Module Chuẩn

Mỗi module business tuân theo pattern:

```
module-name/
├── admin/                          # Admin CRUD
│   ├── module-name.module.ts
│   ├── controllers/
│   ├── services/
│   └── dtos/
├── public/                         # Public Read-only
│   ├── module-name.module.ts
│   ├── controllers/
│   └── services/
├── repositories/                   # Data Access Layer
│   ├── module-name.repository.interface.ts
│   └── module-name.prisma.repository.ts
├── module-name.repository.module.ts
└── module-name.module.ts           # Root module (gom admin + public)
```

## 🔄 Mapping Cũ → Mới

| Cũ | Mới | Ghi chú |
|---|---|---|
| `modules/common/auth` | `modules/core/auth` | - |
| `modules/common/user-management` | `modules/core/iam` | ⭐ Đổi tên |
| `modules/rbac` | `modules/core/rbac` | - |
| `modules/context` | `modules/core/context` | - |
| `modules/common/system-config` | `modules/core/system-config` | - |
| `modules/common/menu` | `modules/core/menu` | - |
| `modules/extra/notification` | `modules/core/notification` | - |
| `modules/common/file-upload` | `modules/storage/file-upload` | - |
| `modules/homepage` | `modules/introduction/homepage` | - |
| `modules/common/about` | `modules/introduction/about` | - |
| `modules/contact` | `modules/introduction/contact` | - |
| `modules/common/faq` | `modules/introduction/faq` | - |
| `modules/extra/banner` | `modules/marketing/banner` | - |

## ✅ Checklist Hoàn Thành

- [x] Tạo thư mục mới: `core`, `storage`, `marketing`
- [x] Di chuyển các module vào đúng nhóm
- [x] Đổi tên `user-management` → `iam`
- [x] Cập nhật tất cả import paths
- [x] Xóa thư mục cũ: `common`, `extra`
- [x] Build thành công
- [x] Cập nhật documentation

## 🚀 Lợi Ích

1. **Rõ ràng hơn**: Phân biệt rõ Platform vs Business modules
2. **Dễ tìm kiếm**: Biết ngay module nằm ở đâu dựa vào chức năng
3. **Dễ mở rộng**: Thêm module mới vào đúng domain
4. **Chuẩn hóa**: Tất cả module đều follow cùng một pattern
5. **Microservices-ready**: Có thể tách thành services riêng nếu cần

## 📝 Import Path Examples

```typescript
// Core modules
import { AuthService } from '@/modules/core/auth/services/auth.service';
import { UserService } from '@/modules/core/iam/user/user/services/user.service';
import { RbacService } from '@/modules/core/rbac/services/rbac.service';

// Storage modules
import { FileUploadService } from '@/modules/storage/file-upload/services/file-upload.service';

// Introduction modules
import { AboutService } from '@/modules/introduction/about/admin/services/about.service';
import { ProjectService } from '@/modules/introduction/project/admin/services/project.service';

// Marketing modules
import { BannerService } from '@/modules/marketing/banner/admin/services/banner.service';
```

---

**Tài liệu chi tiết**: [MODULE_REFACTORING_COMPLETED.md](./MODULE_REFACTORING_COMPLETED.md)
