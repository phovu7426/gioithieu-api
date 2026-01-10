# Kế Hoạch Nâng Cấp Database & API

## 📋 Tổng Quan

Dự án cần nâng cấp từ hệ thống Comics sang hệ thống Web Giới Thiệu Công Ty Xây Dựng với 8 bảng mới.

**Thời gian ước tính:** 3-4 tuần  
**Độ ưu tiên:** Cao

---

## 🎯 Mục Tiêu

1. ✅ Tạo 8 bảng mới trong Prisma schema
2. ✅ Tạo migration và chạy migration
3. ✅ Tạo 8 modules NestJS tương ứng
4. ✅ Tạo API Admin và Public cho mỗi module
5. ✅ Ẩn/Xóa module Comics không cần thiết
6. ✅ Cập nhật documentation

---

## 📦 Các Module Cần Tạo

### Phase 1 - Core (Tuần 1)
1. **Projects** - Quản lý dự án ⭐ QUAN TRỌNG NHẤT
2. **AboutSection** - Giới thiệu công ty
3. **Staff** - Đội ngũ nhân viên

### Phase 2 - Quan trọng (Tuần 2)
4. **Testimonials** - Lời chứng thực
5. **Partners** - Đối tác/Khách hàng
6. **Gallery** - Thư viện ảnh

### Phase 3 - Bổ sung (Tuần 3-4)
7. **Certificates** - Chứng chỉ/Giải thưởng
8. **Faq** - Câu hỏi thường gặp

---

## 🔧 Công Việc Chi Tiết

### Bước 1: Chuẩn Bị Database
- [ ] Thêm các model vào `prisma/schema.prisma`
- [ ] Thêm các enum cần thiết
- [ ] Tạo migration: `npm run prisma:migrate dev --name add_company_intro_tables`
- [ ] Kiểm tra migration thành công

### Bước 2: Tạo Modules (Lặp lại cho mỗi module)

#### Template cho mỗi module:
```
src/modules/{module-name}/
├── {module-name}.module.ts
├── admin/
│   ├── controllers/
│   ├── services/
│   ├── dto/
│   └── README.md
├── public/
│   ├── controllers/
│   ├── services/
│   └── README.md
└── core/
    ├── entities/
    └── interfaces/
```

**Checklist cho mỗi module:**
- [ ] Tạo module structure
- [ ] Tạo entity/Prisma model
- [ ] Tạo DTOs (Create, Update, Query)
- [ ] Tạo Admin Service & Controller
- [ ] Tạo Public Service & Controller
- [ ] Thêm validation
- [ ] Thêm RBAC permissions
- [ ] Viết API documentation
- [ ] Test API endpoints

### Bước 3: Cleanup
- [ ] Ẩn/comment module Comics trong `app.module.ts`
- [ ] Cập nhật README.md
- [ ] Tạo .env.example nếu chưa có

### Bước 4: Testing & Documentation
- [ ] Test tất cả API endpoints
- [ ] Cập nhật Swagger documentation
- [ ] Viết integration guide cho Frontend

---

## 📝 Chi Tiết Từng Phase

Xem các file chi tiết:
- [Phase 1 - Core Modules](./KE_HOACH_PHASE_1.md)
- [Phase 2 - Important Modules](./KE_HOACH_PHASE_2.md)
- [Phase 3 - Additional Modules](./KE_HOACH_PHASE_3.md)

---

## ⚠️ Lưu Ý Quan Trọng

1. **Backup Database** trước khi chạy migration
2. **Test migration** trên môi trường dev trước
3. **Tạo branch mới** cho mỗi phase
4. **Code review** trước khi merge
5. **Documentation** phải cập nhật song song với code

---

## 📚 Tài Liệu Tham Khảo

- [DE_XUAT_PHAT_TRIEN.md](./DE_XUAT_PHAT_TRIEN.md) - Chi tiết database schema
- [docs/api/README.md](./docs/api/README.md) - API documentation structure
- Các module hiện có: `post`, `banner`, `contact` để tham khảo pattern

---

## ✅ Checklist Tổng Quan

- [ ] Phase 1 hoàn thành
- [ ] Phase 2 hoàn thành
- [ ] Phase 3 hoàn thành
- [ ] Cleanup hoàn thành
- [ ] Testing hoàn thành
- [ ] Documentation hoàn thành
- [ ] Code review & merge

---

**Cập nhật lần cuối:** {{ ngày hiện tại }}

