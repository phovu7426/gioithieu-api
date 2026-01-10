# Phase 1: Core Modules (Tuần 1)

## 🎯 Mục Tiêu
Tạo 3 module core quan trọng nhất: Projects, AboutSection, Staff

---

## 1. Projects Module ⭐ QUAN TRỌNG NHẤT

### Database
- [ ] Thêm model `Project` vào `prisma/schema.prisma`
- [ ] Thêm enum `ProjectStatus`
- [ ] Tạo migration
- [ ] Seed dữ liệu mẫu

### Module Structure
```
src/modules/project/
├── project.module.ts
├── admin/
│   ├── controllers/project-admin.controller.ts
│   ├── services/project-admin.service.ts
│   ├── dto/
│   │   ├── create-project.dto.ts
│   │   ├── update-project.dto.ts
│   │   └── query-project.dto.ts
│   └── README.md
├── public/
│   ├── controllers/project-public.controller.ts
│   ├── services/project-public.service.ts
│   └── README.md
└── core/
    └── interfaces/
```

### API Endpoints

#### Admin
- `GET /api/admin/projects` - List projects (với filter, pagination)
- `GET /api/admin/projects/:id` - Get project detail
- `POST /api/admin/projects` - Create project
- `PUT /api/admin/projects/:id` - Update project
- `DELETE /api/admin/projects/:id` - Delete project (soft delete)
- `PATCH /api/admin/projects/:id/status` - Update status
- `PATCH /api/admin/projects/:id/featured` - Toggle featured

#### Public
- `GET /api/projects` - List projects (public, active only)
- `GET /api/projects/:slug` - Get project by slug
- `GET /api/projects/featured` - Get featured projects

### Features
- [ ] Upload cover image & multiple images
- [ ] Slug auto-generation từ name
- [ ] SEO fields (meta_title, meta_description, og_image)
- [ ] View count tracking
- [ ] Soft delete
- [ ] RBAC permissions

### Testing
- [ ] Test CRUD operations
- [ ] Test image upload
- [ ] Test slug generation
- [ ] Test filters & pagination
- [ ] Test permissions

**Ước tính:** 2-3 ngày

---

## 2. AboutSection Module

### Database
- [ ] Thêm model `AboutSection` vào schema
- [ ] Thêm enum `AboutSectionType`
- [ ] Tạo migration

### Module Structure
```
src/modules/about/
├── about.module.ts
├── admin/
│   ├── controllers/about-admin.controller.ts
│   ├── services/about-admin.service.ts
│   ├── dto/
│   │   ├── create-about.dto.ts
│   │   ├── update-about.dto.ts
│   │   └── query-about.dto.ts
│   └── README.md
├── public/
│   ├── controllers/about-public.controller.ts
│   ├── services/about-public.service.ts
│   └── README.md
└── core/
    └── interfaces/
```

### API Endpoints

#### Admin
- `GET /api/admin/about-sections` - List sections
- `GET /api/admin/about-sections/:id` - Get detail
- `POST /api/admin/about-sections` - Create section
- `PUT /api/admin/about-sections/:id` - Update section
- `DELETE /api/admin/about-sections/:id` - Delete section
- `PATCH /api/admin/about-sections/reorder` - Reorder sections

#### Public
- `GET /api/about-sections` - List active sections
- `GET /api/about-sections/:slug` - Get by slug
- `GET /api/about-sections/type/:type` - Get by type (history, mission, vision, etc.)

### Features
- [ ] Support video_url
- [ ] Image upload
- [ ] Section type filtering
- [ ] Sort order management
- [ ] Rich text content (LongText)

### Testing
- [ ] Test CRUD operations
- [ ] Test section types
- [ ] Test reordering
- [ ] Test public endpoints

**Ước tính:** 1-2 ngày

---

## 3. Staff Module

### Database
- [ ] Thêm model `Staff` vào schema
- [ ] Tạo migration

### Module Structure
```
src/modules/staff/
├── staff.module.ts
├── admin/
│   ├── controllers/staff-admin.controller.ts
│   ├── services/staff-admin.service.ts
│   ├── dto/
│   │   ├── create-staff.dto.ts
│   │   ├── update-staff.dto.ts
│   │   └── query-staff.dto.ts
│   └── README.md
├── public/
│   ├── controllers/staff-public.controller.ts
│   ├── services/staff-public.service.ts
│   └── README.md
└── core/
    └── interfaces/
```

### API Endpoints

#### Admin
- `GET /api/admin/staff` - List staff
- `GET /api/admin/staff/:id` - Get detail
- `POST /api/admin/staff` - Create staff
- `PUT /api/admin/staff/:id` - Update staff
- `DELETE /api/admin/staff/:id` - Delete staff
- `PATCH /api/admin/staff/reorder` - Reorder staff

#### Public
- `GET /api/staff` - List active staff
- `GET /api/staff/:id` - Get staff detail
- `GET /api/staff/department/:department` - Get by department

### Features
- [ ] Avatar upload
- [ ] Social links (JSON field)
- [ ] Department filtering
- [ ] Sort order management
- [ ] Experience years

### Testing
- [ ] Test CRUD operations
- [ ] Test avatar upload
- [ ] Test social links JSON
- [ ] Test department filter

**Ước tính:** 1-2 ngày

---

## 📋 Checklist Phase 1

### Database
- [ ] Tất cả models đã thêm vào schema.prisma
- [ ] Tất cả enums đã thêm
- [ ] Migration đã chạy thành công
- [ ] Database đã được backup

### Modules
- [ ] Projects module hoàn thành
- [ ] AboutSection module hoàn thành
- [ ] Staff module hoàn thành
- [ ] Tất cả modules đã được import vào app.module.ts

### Testing
- [ ] Tất cả API endpoints đã test
- [ ] Permissions đã test
- [ ] Image upload đã test
- [ ] Validation đã test

### Documentation
- [ ] API docs đã cập nhật
- [ ] README cho mỗi module đã viết
- [ ] Swagger đã cập nhật

---

## ⏱️ Timeline

- **Ngày 1-2:** Projects module
- **Ngày 3:** AboutSection module
- **Ngày 4:** Staff module
- **Ngày 5:** Testing & Bug fixes
- **Ngày 6-7:** Code review & Documentation

**Tổng:** 5-7 ngày làm việc

