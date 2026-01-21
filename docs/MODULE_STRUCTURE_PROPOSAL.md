# Đề Xuất Cấu Trúc Module Mới

> **Trạng thái**: ✅ **ĐÃ HOÀN THÀNH** - Ngày 2026-01-21  
> **Chi tiết**: Xem [MODULE_REFACTORING_COMPLETED.md](./MODULE_REFACTORING_COMPLETED.md)

Tài liệu này mô tả cấu trúc thư mục mới cho dự án, được tổ chức lại dựa trên các nhóm chức năng: **Core** (Nền tảng), **Storage** (Lưu trữ), **Pages** (Các trang đơn), và **Business Domains** (Nghiệp vụ chính).

## 1. Cấu Trúc Cây Thư Mục

```text
src/modules/
├── core/                       # [PLATFORM] Nhóm Core (Nền tảng kỹ thuật)
│   ├── auth/                   # Xác thực (Login, Register, JWT)
│   ├── iam/                    # [RENAME] Identity & Access Management (User, Profile)
│   ├── rbac/                   # Phân quyền (Role-Based Access Control)
│   ├── context/                # Context quản lý request/response
│   ├── system-config/          # Cấu hình hệ thống động
│   ├── menu/                   # Quản lý Menu (Header/Footer)
│   └── notification/           # Hệ thống thông báo
│
├── storage/                    # [PLATFORM] Nhóm Lưu trữ
│   └── file-upload/            # [SINGULAR] Upload và quản lý tập tin
│
├── homepage/                   # [DOMAIN] Trang chủ (Tổng hợp dữ liệu Dashboard)
├── introduction/               # [DOMAIN] Nghiệp vụ "Giới Thiệu Doanh Nghiệp"
│   ├── about/                  # [MOVED] Giới thiệu chung "Về chúng tôi"
│   ├── contact/                # [MOVED] Liên hệ & Phản hồi
│   ├── faq/                    # [MOVED] Hỏi đáp thường gặp
│   ├── project/                # [SINGULAR] Dự án (Portfolio)
│   ├── partner/                # [SINGULAR] Đối tác / Khách hàng
│   ├── staff/                  # [SINGULAR] Nhân sự / Team
│   ├── testimonial/            # [SINGULAR] Khách hàng đánh giá
│   ├── certificate/            # [SINGULAR] Chứng chỉ / Giải thưởng
│   └── gallery/                # [SINGULAR] Thư viện ảnh
│
├── post/                       # [DOMAIN] Nghiệp vụ Tin tức / Blog
│   ├── post/                   # [SINGULAR] Quản lý bài viết (Posts)
│   ├── category/               # [SINGULAR] Danh mục bài viết (Categories)
│   ├── tag/                    # [SINGULAR] Thẻ bài viết (Tags)
│   ├── comment/                # [SINGULAR] Bình luận (Comments)
│   └── cron/                   # Tác vụ ngầm (View counter sync)
│
└── marketing/                  # [DOMAIN] Nghiệp vụ Marketing
    └── banner/                 # [SINGULAR] Banner / Slider quảng cá
```

## 2. Chi Tiết Thay Đổi

### Nhóm `core` (Thay thế cho phần lớn `common` + `rbac` + `context`)
Đây là nơi chứa "trái tim" của hệ thống. Các module ở đây cung cấp hạ tầng kỹ thuật cho toàn bộ ứng dụng.
- **Nguồn cũ**: `common/auth`, `common/user-management`, `common/system-config`, `common/menu`, `rbac`, `context`, `extra/notification`.
- **Thay đổi lớn**: Đổi tên `user-management` thành `iam` (Identity Access Management) cho chuyên nghiệp hơn.

### Nhóm `storage`
Tách biệt hoàn toàn việc xử lý file ra khỏi logic nghiệp vụ chung.
- **Nguồn cũ**: `common/file-upload`.
- **Lý do**: Lưu trữ là một domain kỹ thuật riêng biệt, có thể tái sử dụng hoặc thay thế (ví dụ chuyển từ Disk sang Cloud) mà không ảnh hưởng module khác.

### Nhóm `pages` (Đã loại bỏ - Merge vào `introduction`)
- **Nguồn cũ**: `common/about`, `common/faq`, `homepage`, `contact`.
- **Thay đổi**: Di chuyển tất cả module này vào trong nhóm `introduction` vì chúng đều phục vụ mục đích giới thiệu thông tin doanh nghiệp.

### Nhóm `introduction` (Mở rộng)
Đây là **Core Business** của dự án "Web Giới Thiệu".
- Ngoài các module cũ (`project`, `partner`...), nay chứa thêm `homepage`, `about`, `contact`, `faq`.
- **Quy tắc đặt tên**: Tất cả thư mục con dùng danh từ **số ít** (Singular). Ví dụ: `project` thay vì `projects`.

### Nhóm `post` (Chuẩn hóa)
- Cấu trúc lại và chuẩn hóa tên gọi sang **số ít** (Singular) để đồng bộ với toàn dự án:
    - `post`: Quản lý bài viết (thay vì `posts`).
    - `category`: Quản lý danh mục (thay vì `categories`).
    - `tag`: Quản lý thẻ (thay vì `tags`).
    - `comment`: Quản lý bình luận (thay vì `comments`).
    - `cron`: Các tác vụ chạy ngầm.

### Nhóm `marketing` (Đổi tên từ `extra`)
- **Nguồn cũ**: `extra/banner`.
- **Lý do**: Tên `extra` khá tối nghĩa. `marketing` thể hiện rõ mục đích của module banner là phục vụ quảng bá hình ảnh.

## 3. Lộ Trình Refactor (Gợi ý)

1.  **Tạo thư mục mới**: Tạo các thư mục `core`, `storage`, `pages`, `marketing` trong `src/modules`.
2.  **Di chuyển (Move)**:
    *   `src/modules/common/auth` -> `src/modules/core/auth`
    *   `src/modules/common/file-upload` -> `src/modules/storage/file-upload`
    *   ... (tương tự cho các module khác).
3.  **Cập nhật Import**: Dùng tính năng *Find and Replace* của IDE để cập nhật lại đường dẫn import.
    *   Ví dụ: `@/modules/common/auth` -> `@/modules/core/auth`.
4.  **Kiểm tra**: Chạy thử ứng dụng để đảm bảo không có lỗi `Module not found`.
