# Phase 2: Important Modules (Tuần 2)

## 🎯 Mục Tiêu
Tạo 3 module quan trọng: Testimonials, Partners, Gallery

---

## 1. Testimonials Module

### Database
- [ ] Thêm model `Testimonial` vào schema
- [ ] Thêm relation với `Project` (optional)
- [ ] Tạo migration

### Module Structure
```
src/modules/testimonial/
├── testimonial.module.ts
├── admin/
│   ├── controllers/testimonial-admin.controller.ts
│   ├── services/testimonial-admin.service.ts
│   ├── dto/
│   │   ├── create-testimonial.dto.ts
│   │   ├── update-testimonial.dto.ts
│   │   └── query-testimonial.dto.ts
│   └── README.md
├── public/
│   ├── controllers/testimonial-public.controller.ts
│   ├── services/testimonial-public.service.ts
│   └── README.md
└── core/
    └── interfaces/
```

### API Endpoints

#### Admin
- `GET /api/admin/testimonials` - List testimonials
- `GET /api/admin/testimonials/:id` - Get detail
- `POST /api/admin/testimonials` - Create testimonial
- `PUT /api/admin/testimonials/:id` - Update testimonial
- `DELETE /api/admin/testimonials/:id` - Delete testimonial
- `PATCH /api/admin/testimonials/:id/featured` - Toggle featured

#### Public
- `GET /api/testimonials` - List active testimonials
- `GET /api/testimonials/featured` - Get featured testimonials
- `GET /api/testimonials/project/:projectId` - Get by project

### Features
- [ ] Link với Project (optional)
- [ ] Rating (1-5 sao)
- [ ] Client avatar upload
- [ ] Featured testimonials
- [ ] Sort order

### Testing
- [ ] Test CRUD operations
- [ ] Test project relation
- [ ] Test rating validation
- [ ] Test featured filter

**Ước tính:** 1-2 ngày

---

## 2. Partners Module

### Database
- [ ] Thêm model `Partner` vào schema
- [ ] Thêm enum `PartnerType`
- [ ] Tạo migration

### Module Structure
```
src/modules/partner/
├── partner.module.ts
├── admin/
│   ├── controllers/partner-admin.controller.ts
│   ├── services/partner-admin.service.ts
│   ├── dto/
│   │   ├── create-partner.dto.ts
│   │   ├── update-partner.dto.ts
│   │   └── query-partner.dto.ts
│   └── README.md
├── public/
│   ├── controllers/partner-public.controller.ts
│   ├── services/partner-public.service.ts
│   └── README.md
└── core/
    └── interfaces/
```

### API Endpoints

#### Admin
- `GET /api/admin/partners` - List partners
- `GET /api/admin/partners/:id` - Get detail
- `POST /api/admin/partners` - Create partner
- `PUT /api/admin/partners/:id` - Update partner
- `DELETE /api/admin/partners/:id` - Delete partner

#### Public
- `GET /api/partners` - List active partners
- `GET /api/partners/type/:type` - Get by type (client, supplier, partner)

### Features
- [ ] Logo upload
- [ ] Partner type (client, supplier, partner)
- [ ] Website link
- [ ] Sort order

### Testing
- [ ] Test CRUD operations
- [ ] Test logo upload
- [ ] Test type filtering
- [ ] Test website validation

**Ước tính:** 1 ngày

---

## 3. Gallery Module

### Database
- [ ] Thêm model `Gallery` vào schema
- [ ] Tạo migration

### Module Structure
```
src/modules/gallery/
├── gallery.module.ts
├── admin/
│   ├── controllers/gallery-admin.controller.ts
│   ├── services/gallery-admin.service.ts
│   ├── dto/
│   │   ├── create-gallery.dto.ts
│   │   ├── update-gallery.dto.ts
│   │   └── query-gallery.dto.ts
│   └── README.md
├── public/
│   ├── controllers/gallery-public.controller.ts
│   ├── services/gallery-public.service.ts
│   └── README.md
└── core/
    └── interfaces/
```

### API Endpoints

#### Admin
- `GET /api/admin/gallery` - List galleries
- `GET /api/admin/gallery/:id` - Get detail
- `POST /api/admin/gallery` - Create gallery
- `PUT /api/admin/gallery/:id` - Update gallery
- `DELETE /api/admin/gallery/:id` - Delete gallery
- `POST /api/admin/gallery/:id/images` - Upload multiple images
- `DELETE /api/admin/gallery/:id/images/:imageIndex` - Delete image

#### Public
- `GET /api/gallery` - List active galleries
- `GET /api/gallery/:slug` - Get by slug
- `GET /api/gallery/featured` - Get featured galleries

### Features
- [ ] Multiple images upload (JSON array)
- [ ] Cover image
- [ ] Slug generation
- [ ] Featured galleries
- [ ] Sort order

### Testing
- [ ] Test CRUD operations
- [ ] Test multiple images upload
- [ ] Test image deletion
- [ ] Test slug generation

**Ước tính:** 2 ngày

---

## 📋 Checklist Phase 2

### Database
- [ ] Testimonials model đã thêm
- [ ] Partners model đã thêm
- [ ] Gallery model đã thêm
- [ ] Migration đã chạy thành công

### Modules
- [ ] Testimonials module hoàn thành
- [ ] Partners module hoàn thành
- [ ] Gallery module hoàn thành
- [ ] Tất cả modules đã được import vào app.module.ts

### Testing
- [ ] Tất cả API endpoints đã test
- [ ] Image upload đã test
- [ ] Relations đã test
- [ ] Validation đã test

### Documentation
- [ ] API docs đã cập nhật
- [ ] README cho mỗi module đã viết

---

## ⏱️ Timeline

- **Ngày 1:** Testimonials module
- **Ngày 2:** Partners module
- **Ngày 3-4:** Gallery module
- **Ngày 5:** Testing & Bug fixes
- **Ngày 6-7:** Code review & Documentation

**Tổng:** 5-7 ngày làm việc

