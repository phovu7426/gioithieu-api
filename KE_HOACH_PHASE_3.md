# Phase 3: Additional Modules (Tuần 3-4)

## 🎯 Mục Tiêu
Tạo 2 module bổ sung: Certificates, Faq

---

## 1. Certificates Module

### Database
- [ ] Thêm model `Certificate` vào schema
- [ ] Thêm enum `CertificateType`
- [ ] Tạo migration

### Module Structure
```
src/modules/certificate/
├── certificate.module.ts
├── admin/
│   ├── controllers/certificate-admin.controller.ts
│   ├── services/certificate-admin.service.ts
│   ├── dto/
│   │   ├── create-certificate.dto.ts
│   │   ├── update-certificate.dto.ts
│   │   └── query-certificate.dto.ts
│   └── README.md
├── public/
│   ├── controllers/certificate-public.controller.ts
│   ├── services/certificate-public.service.ts
│   └── README.md
└── core/
    └── interfaces/
```

### API Endpoints

#### Admin
- `GET /api/admin/certificates` - List certificates
- `GET /api/admin/certificates/:id` - Get detail
- `POST /api/admin/certificates` - Create certificate
- `PUT /api/admin/certificates/:id` - Update certificate
- `DELETE /api/admin/certificates/:id` - Delete certificate

#### Public
- `GET /api/certificates` - List active certificates
- `GET /api/certificates/type/:type` - Get by type (iso, award, license, etc.)

### Features
- [ ] Certificate image upload
- [ ] Certificate type filtering
- [ ] Issued date & expiry date
- [ ] Certificate number
- [ ] Issued by organization

### Testing
- [ ] Test CRUD operations
- [ ] Test image upload
- [ ] Test type filtering
- [ ] Test date validation

**Ước tính:** 1-2 ngày

---

## 2. Faq Module

### Database
- [ ] Thêm model `Faq` vào schema
- [ ] Tạo migration

### Module Structure
```
src/modules/faq/
├── faq.module.ts
├── admin/
│   ├── controllers/faq-admin.controller.ts
│   ├── services/faq-admin.service.ts
│   ├── dto/
│   │   ├── create-faq.dto.ts
│   │   ├── update-faq.dto.ts
│   │   └── query-faq.dto.ts
│   └── README.md
├── public/
│   ├── controllers/faq-public.controller.ts
│   ├── services/faq-public.service.ts
│   └── README.md
└── core/
    └── interfaces/
```

### API Endpoints

#### Admin
- `GET /api/admin/faqs` - List FAQs
- `GET /api/admin/faqs/:id` - Get detail
- `POST /api/admin/faqs` - Create FAQ
- `PUT /api/admin/faqs/:id` - Update FAQ
- `DELETE /api/admin/faqs/:id` - Delete FAQ
- `PATCH /api/admin/faqs/reorder` - Reorder FAQs

#### Public
- `GET /api/faqs` - List active FAQs
- `GET /api/faqs/:id` - Get FAQ detail
- `POST /api/faqs/:id/helpful` - Mark as helpful (tăng helpful_count)
- `GET /api/faqs/popular` - Get popular FAQs (by view_count)

### Features
- [ ] View count tracking
- [ ] Helpful count (user feedback)
- [ ] Sort order
- [ ] Search functionality (optional)

### Testing
- [ ] Test CRUD operations
- [ ] Test view count increment
- [ ] Test helpful count increment
- [ ] Test reordering
- [ ] Test popular FAQs

**Ước tính:** 1-2 ngày

---

## 📋 Checklist Phase 3

### Database
- [ ] Certificates model đã thêm
- [ ] Faq model đã thêm
- [ ] Migration đã chạy thành công

### Modules
- [ ] Certificates module hoàn thành
- [ ] Faq module hoàn thành
- [ ] Tất cả modules đã được import vào app.module.ts

### Testing
- [ ] Tất cả API endpoints đã test
- [ ] Image upload đã test
- [ ] Count tracking đã test
- [ ] Validation đã test

### Documentation
- [ ] API docs đã cập nhật
- [ ] README cho mỗi module đã viết

---

## ⏱️ Timeline

- **Ngày 1-2:** Certificates module
- **Ngày 3-4:** Faq module
- **Ngày 5:** Testing & Bug fixes
- **Ngày 6-7:** Code review & Documentation

**Tổng:** 5-7 ngày làm việc

---

## 🎉 Hoàn Thành Tất Cả Phases

Sau khi hoàn thành Phase 3, cần:

### Cleanup
- [ ] Ẩn/comment module Comics trong `app.module.ts`
- [ ] Xóa các file không cần thiết (nếu có)
- [ ] Cập nhật README.md chính

### Final Testing
- [ ] Integration test tất cả modules
- [ ] Performance test
- [ ] Security review

### Documentation
- [ ] Cập nhật Swagger
- [ ] Viết integration guide cho Frontend
- [ ] Cập nhật API documentation tổng hợp

