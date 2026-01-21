# 📚 Tài Liệu Dự Án - Documentation Index

Thư mục này chứa tất cả tài liệu kỹ thuật của dự án.

## 📋 Mục Lục

### 🏗️ Kiến Trúc & Cấu Trúc

1. **[MODULE_STRUCTURE_PROPOSAL.md](./MODULE_STRUCTURE_PROPOSAL.md)** ✅ Hoàn thành
   - Đề xuất cấu trúc module mới
   - Phân chia theo Platform và Business Domain
   - Lộ trình refactoring

2. **[MODULE_REFACTORING_COMPLETED.md](./MODULE_REFACTORING_COMPLETED.md)** 📝 Báo cáo
   - Báo cáo chi tiết quá trình refactoring
   - Danh sách thay đổi
   - Kết quả và lợi ích

3. **[MODULE_STRUCTURE_QUICK_REFERENCE.md](./MODULE_STRUCTURE_QUICK_REFERENCE.md)** 🚀 Quick Start
   - Tham chiếu nhanh cấu trúc module
   - Mapping cũ → mới
   - Examples import paths

4. **[SYSTEM_ARCHITECTURE_REVIEW.md](./SYSTEM_ARCHITECTURE_REVIEW.md)**
   - Đánh giá kiến trúc hệ thống
   - Ưu điểm và nhược điểm
   - Khả năng mở rộng

### 🔐 Authentication & Authorization

5. **[GOOGLE_LOGIN_INTEGRATION_GUIDE.md](./GOOGLE_LOGIN_INTEGRATION_GUIDE.md)**
   - Hướng dẫn tích hợp Google Login
   - Server-side authorization code flow
   - Frontend integration guide

### 📡 API Documentation

6. **[api-public-post.md](./api-public-post.md)**
   - Public Post APIs
   - Endpoints, parameters, responses

7. **[api-admin-post-comment.md](./api-admin-post-comment.md)**
   - Admin Post Comment APIs
   - Comment management endpoints

8. **[api/](./api/)** - Thư mục chứa tất cả API documentation chi tiết
   - Các file API docs cho từng module
   - Request/Response examples

### 🗄️ Database

9. **[database_schema/](./database_schema/)** - Database schema documentation
   - Prisma schema
   - ERD diagrams
   - Migration guides

### 📝 Planning & Proposals

10. **[plans/](./plans/)** - Kế hoạch và đề xuất tính năng
    - Feature proposals
    - Enhancement plans

### 🔧 Core Documentation

11. **[core/](./core/)** - Core system documentation
    - Core modules documentation
    - System utilities

---

## 🎯 Tài Liệu Quan Trọng Nhất

Nếu bạn mới tham gia dự án, hãy đọc theo thứ tự:

1. ✅ **[MODULE_STRUCTURE_QUICK_REFERENCE.md](./MODULE_STRUCTURE_QUICK_REFERENCE.md)** - Hiểu cấu trúc dự án
2. 📖 **[SYSTEM_ARCHITECTURE_REVIEW.md](./SYSTEM_ARCHITECTURE_REVIEW.md)** - Hiểu kiến trúc tổng thể
3. 🔐 **[GOOGLE_LOGIN_INTEGRATION_GUIDE.md](./GOOGLE_LOGIN_INTEGRATION_GUIDE.md)** - Nếu làm việc với authentication
4. 📡 **[api/](./api/)** - Tham khảo API documentation

---

## 📌 Quy Ước

### Đặt Tên File
- Sử dụng UPPERCASE cho tài liệu quan trọng: `MODULE_STRUCTURE_PROPOSAL.md`
- Sử dụng lowercase-with-dashes cho API docs: `api-public-post.md`

### Cấu Trúc Tài Liệu
Mỗi tài liệu nên có:
1. **Tiêu đề rõ ràng**
2. **Mục lục** (nếu dài)
3. **Nội dung chi tiết**
4. **Examples** (nếu có)
5. **Ghi chú/Lưu ý**

### Cập Nhật Tài Liệu
- Luôn cập nhật tài liệu khi có thay đổi code
- Đánh dấu trạng thái: ✅ Hoàn thành, 🚧 Đang làm, ⏳ Chờ xử lý
- Ghi rõ ngày cập nhật

---

## 🔄 Lịch Sử Cập Nhật

| Ngày | Tài Liệu | Mô Tả |
|------|----------|-------|
| 2026-01-21 | MODULE_REFACTORING_COMPLETED.md | Hoàn thành refactoring module structure |
| 2026-01-21 | MODULE_STRUCTURE_QUICK_REFERENCE.md | Tạo quick reference guide |
| 2026-01-20 | GOOGLE_LOGIN_INTEGRATION_GUIDE.md | Hướng dẫn tích hợp Google Login |
| 2026-01-20 | SYSTEM_ARCHITECTURE_REVIEW.md | Đánh giá kiến trúc hệ thống |

---

**Lưu ý**: Tài liệu này được cập nhật liên tục. Nếu bạn tìm thấy thông tin lỗi thời hoặc thiếu sót, vui lòng cập nhật hoặc thông báo cho team.
