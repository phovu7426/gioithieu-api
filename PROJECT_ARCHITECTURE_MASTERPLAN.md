# PROJECT ARCHITECTURE MASTERPLAN (Complete Reference)

Tài liệu này là **Single Source of Truth** (nguồn duy nhất) quy định cấu trúc thư mục, quy tắc đặt tên và hướng dẫn thiết kế cho toàn bộ dự án `gioithieu-api`.

---

## 1. Nguyên tắc Thiết kế (Design Principles)

1.  **Hierarchical Domain Structure**: Hệ thống được chia thành 3 Domain lớn (`rbac`, `content`, `system`). Các module con nằm lồng bên trong module cha để thể hiện mối quan hệ nghiệp vụ.
2.  **Naming Convention**: Tên thư mục phải trùng khớp với tên file module chính bên trong (Ví dụ: thư mục `post-categories` chứa `post-categories.module.ts`).
3.  **Flattened Internal Structure**: Bên trong mỗi module, các thành phần (`controllers`, `services`...) được để phẳng, không lồng cấp `admin/` hay `public/`.
4.  **Separation of Concerns**: Tách biệt logic Admin và Public ở tầng Service và Controller thông qua tiền tố tên file (`admin-*.ts`, `public-*.ts`).

---

## 2. Cấu trúc Thư mục Chi tiết (Full Directory Tree)

Dưới đây là cây thư mục đầy đủ của `src/modules`. Mọi file code thực tế sẽ nằm trong cấu trúc này.

```text
src/
└── modules/
    ├── rbac/                               <-- DOMAIN: Identity & Access Control
    │   ├── auth/                           (Module: Authentication)
    │   │   ├── dto/
    │   │   ├── guards/
    │   │   ├── strategies/
    │   │   ├── services/
    │   │   ├── controllers/
    │   │   └── auth.module.ts              
    │   │
    │   ├── users/                          (Module: User Management)
    │   │   ├── dto/
    │   │   ├── entities/
    │   │   ├── repositories/
    │   │   ├── services/
    │   │   ├── controllers/
    │   │   └── users.module.ts
    │   │
    │   └── access-control/                 (Module: Roles & Permissions)
    │       ├── dto/
    │       ├── entities/
    │       ├── repositories/
    │       ├── services/
    │       ├── controllers/
    │       └── access-control.module.ts
    │
    ├── content/                            <-- DOMAIN: Content Management
    │   ├── posts/                          (Parent Module: Posts Core)
    │   │   ├── post-categories/            (Sub-Module: Categories)
    │   │   │   ├── dto/
    │   │   │   ├── entities/
    │   │   │   ├── repositories/
    │   │   │   ├── services/
    │   │   │   ├── controllers/
    │   │   │   └── post-categories.module.ts
    │   │   │
    │   │   ├── post-tags/                  (Sub-Module: Tags)
    │   │   │   ├── dto/
    │   │   │   ├── entities/
    │   │   │   ├── repositories/
    │   │   │   ├── services/
    │   │   │   ├── controllers/
    │   │   │   └── post-tags.module.ts
    │   │   │
    │   │   ├── post-comments/              (Sub-Module: Comments)
    │   │   │   ├── dto/
    │   │   │   ├── entities/
    │   │   │   ├── repositories/
    │   │   │   ├── services/
    │   │   │   ├── controllers/
    │   │   │   └── post-comments.module.ts
    │   │   │
    │   │   ├── dto/                        (Post DTOs)
    │   │   ├── entities/                   (Post Entity)
    │   │   ├── repositories/               (Post Repository)
    │   │   ├── services/                   (Post Services)
    │   │   ├── controllers/                (Post Controllers)
    │   │   └── posts.module.ts             (Root Post Module)
    │   │
    │   ├── pages/                          (Parent Module: Static Pages)
    │   │   ├── about/                      (Sub-Module: About Page)
    │   │   │   ├── dto/
    │   │   │   ├── entities/
    │   │   │   ├── repositories/
    │   │   │   ├── services/
    │   │   │   ├── controllers/
    │   │   │   └── about.module.ts
    │   │   │
    │   │   ├── introduction/               (Sub-Module: Introduction)
    │   │   │   ├── dto/
    │   │   │   ├── entities/
    │   │   │   ├── repositories/
    │   │   │   ├── services/
    │   │   │   ├── controllers/
    │   │   │   └── introduction.module.ts
    │   │   │
    │   │   ├── contact/                    (Sub-Module: Contact/Feedback)
    │   │   │   ├── dto/
    │   │   │   ├── entities/
    │   │   │   ├── repositories/
    │   │   │   ├── services/
    │   │   │   ├── controllers/
    │   │   │   └── contact.module.ts
    │   │   │
    │   │   ├── faqs/                       (Sub-Module: FAQs)
    │   │   │   ├── dto/
    │   │   │   ├── entities/
    │   │   │   ├── repositories/
    │   │   │   ├── services/
    │   │   │   ├── controllers/
    │   │   │   └── faqs.module.ts
    │   │   │
    │   │   └── pages.module.ts             (Root Pages Module - Aggregate)
    │   │
    │   └── banners/                        (Module: Banners)
    │       ├── dto/
    │       ├── entities/
    │       ├── repositories/
    │       ├── services/
    │       ├── controllers/
    │       └── banners.module.ts
    │
    └── system/                             <-- DOMAIN: System & Utilities
        ├── configs/                        (Module: Dynamic Configurations)
        │   ├── dto/
        │   ├── entities/
        │   ├── repositories/
        │   ├── services/
        │   ├── controllers/
        │   └── configs.module.ts
        │
        ├── menus/                          (Module: Front-end Menus)
        │   ├── dto/
        │   ├── entities/
        │   ├── repositories/
        │   ├── services/
        │   ├── controllers/
        │   └── menus.module.ts
        │
        ├── storage/                        (Module: File Upload/Media)
        │   ├── dto/
        │   ├── entities/
        │   ├── repositories/
        │   ├── services/
        │   ├── controllers/
        │   └── storage.module.ts
        │
        ├── notifications/                  (Module: Notifications)
        │   ├── dto/
        │   ├── entities/
        │   ├── repositories/
        │   ├── services/
        │   ├── controllers/
        │   └── notifications.module.ts
        │
        └── context/                        (Module: Global Context)
            ├── services/
            └── context.module.ts
```

---

## 3. Quy chuẩn Đặt tên File và Chức năng (Internal Standards)

### A. Controller Layer
Phân loại rõ ràng 2 loại controller trong cùng 1 folder `controllers/`:
1.  **Admin API**: Dành cho CMS, yêu cầu xác thực cao.
    *   Quy tắc đặt tên: `admin-[feature].controller.ts`
    *   Ví dụ: `controllers/admin-post.controller.ts`
2.  **Public API**: Dành cho Website, Client App.
    *   Quy tắc đặt tên: `public-[feature].controller.ts`
    *   Ví dụ: `controllers/public-post.controller.ts`

### B. Service Layer
Tách biệt Business Logic để tránh "God Object".
1.  **Admin Service**: Xử lý logic tạo, sửa, xóa, báo cáo, sync data.
    *   Quy tắc đặt tên: `admin-[feature].service.ts`
    *   Ví dụ: `services/admin-post.service.ts`
2.  **Public Service**: Xử lý logic hiển thị, cache, view counting.
    *   Quy tắc đặt tên: `public-[feature].service.ts`
    *   Ví dụ: `services/public-post.service.ts`
3.  **Helper Service** (Optional): Logic dùng chung (slug, format date).
    *   Quy tắc đặt tên: `[feature]-helper.service.ts`

### C. DTO Layer
Sử dụng kế thừa để kiểm soát input.
1.  **Base DTO**: `base-[feature].dto.ts` (Chứa trường chung: name, description)
2.  **Admin Create DTO**: `admin-create-[feature].dto.ts` (Extends Base + `status`, `config`)
3.  **Public/User Update DTO**: `user-update-[feature].dto.ts` (PickType từ Base)
4.  **Filter/Search DTO**: `[feature]-filter.dto.ts`

### D. Repository Layer
Giữ nguyên Pattern hiện tại.
1.  **Interface**: `I[Feature]Repository.ts`
2.  **Implementation**: `[feature].prisma.repository.ts`

---

## 4. Bảng Kế hoạch Di chuyển (Migration Plan)

| Nguồn hiện tại (Source) | Đích đến mới (Destination) | Tên Module mới |
| :--- | :--- | :--- |
| `src/modules/common/auth` | `src/modules/rbac/auth` | `auth.module.ts` |
| `src/modules/common/user-management` | `src/modules/rbac/users` | `users.module.ts` |
| `(RBAC logic in user-mgmt)` | `src/modules/rbac/access-control` | `access-control.module.ts` |
| `src/modules/post` (root) | `src/modules/content/posts` | `posts.module.ts` |
| `src/modules/post/admin/post-category` | `src/modules/content/posts/post-categories` | `post-categories.module.ts` |
| `src/modules/post/admin/post-tag` | `src/modules/content/posts/post-tags` | `post-tags.module.ts` |
| `src/modules/post/admin/comment` | `src/modules/content/posts/post-comments` | `post-comments.module.ts` |
| `src/modules/common/about` | `src/modules/content/pages/about` | `about.module.ts` |
| `src/modules/common/introduction` | `src/modules/content/pages/introduction` | `introduction.module.ts` |
| `src/modules/common/faq` | `src/modules/content/pages/faqs` | `faqs.module.ts` |
| `src/modules/contact` | `src/modules/content/pages/contact` | `contact.module.ts` |
| `src/modules/extra/banner` | `src/modules/content/banners` | `banners.module.ts` |
| `src/modules/common/system-config` | `src/modules/system/configs` | `configs.module.ts` |
| `src/modules/common/menu` | `src/modules/system/menus` | `menus.module.ts` |
| `src/modules/common/file-upload` | `src/modules/system/storage` | `storage.module.ts` |
| `src/modules/extra/notification` | `src/modules/system/notifications` | `notifications.module.ts` |
| `src/modules/context` | `src/modules/system/context` | `context.module.ts` |

---
Tài liệu này dùng để tra cứu trong suốt quá trình phát triển và nâng cấp hệ thống. Mọi thay đổi về cấu trúc thư mục phải được cập nhật vào tài liệu này trước khi thực thi.
