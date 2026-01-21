# Phân Tích và Đề Xuất Tổ Chức Lại Thư Mục `src/common`

## 📊 Tổng Quan Cấu Trúc Hiện Tại

```
src/common/
├── base/                    (11 files - Base classes & utilities)
│   ├── interfaces/          (2 files)
│   ├── repository/          (2 files)
│   ├── services/            (3 files)
│   └── utils/               (3 files)
├── decorators/              (3 files - Custom decorators)
├── exceptions/              (1 file - Custom exceptions)
├── filters/                 (2 files - Exception filters)
├── guards/                  (2 files - Auth & RBAC guards)
├── interceptors/            (6 files - Various interceptors)
├── interfaces/              (2 files - Auth interfaces)
├── middlewares/             (1 file - Request context)
├── pipes/                   (1 file - Parse BigInt)
├── services/                (2 files - Auth & Cache services)
├── utils/                   (6 files - Utility functions)
├── validators/              (1 file - Custom validators)
└── common.module.ts         (1 file - Module definition)
```

**Tổng cộng:** 12 thư mục + 1 file module = **43 files**

---

## 🔍 Phân Tích Vấn Đề

### 1. **Trùng Lặp Cấu Trúc**
- ❌ `base/interfaces` và `interfaces` - 2 thư mục interfaces riêng biệt
- ❌ `base/services` và `services` - 2 thư mục services riêng biệt
- ❌ `base/utils` và `utils` - 2 thư mục utils riêng biệt

### 2. **Phân Tán Chức Năng**
- **Authentication/Authorization:** Nằm rải rác ở nhiều nơi
  - `guards/jwt-auth.guard.ts` + `guards/rbac.guard.ts`
  - `services/auth.service.ts`
  - `decorators/rbac.decorators.ts`
  - `interfaces/auth-user.interface.ts` + `interfaces/authenticated-request.interface.ts`
  - `utils/auth.util.ts`

- **Caching:** Phân tán
  - `services/cache.service.ts`
  - `interceptors/cache.interceptor.ts`
  - `decorators/cacheable.decorator.ts`

- **File Handling:** Phân tán
  - `utils/file-path.util.ts`
  - `interceptors/file-path.interceptor.ts`

### 3. **Thư Mục Có Ít File**
- `exceptions/` - chỉ 1 file
- `middlewares/` - chỉ 1 file
- `pipes/` - chỉ 1 file
- `validators/` - chỉ 1 file

### 4. **Thư Mục `base` Quá Phức Tạp**
- Có cấu trúc lồng nhau sâu (4 thư mục con)
- Chứa nhiều loại file khác nhau (interfaces, repository, services, utils)

---

## ✅ Đề Xuất Cấu Trúc Mới

### **Nguyên Tắc Tổ Chức:**
1. **Chia theo chức năng (Feature-based)** - Nhóm các file liên quan về mặt nghiệp vụ
2. **Chia theo loại file (Type-based)** - Trong mỗi nhóm chức năng, phân loại theo services, guards, decorators, utils, interfaces, etc.
3. **Giảm độ sâu thư mục** - tối đa 3 cấp (feature/type/file)
4. **Tách biệt rõ ràng** giữa core/base và features cụ thể
5. **Dễ dàng mở rộng** - Thêm feature mới chỉ cần tạo thư mục mới theo pattern

### **Cấu Trúc Đề Xuất:**

```
src/common/
├── core/                           # 🔵 Core/Base abstractions
│   ├── services/
│   │   ├── base.service.ts        # từ base/services/base.service.ts
│   │   ├── base-content.service.ts # từ base/services/base-content.service.ts
│   │   └── index.ts
│   ├── repositories/
│   │   ├── prisma.repository.ts   # từ base/repository/prisma.repository.ts
│   │   ├── repository.interface.ts # từ base/repository/repository.interface.ts
│   │   └── index.ts
│   ├── interfaces/
│   │   ├── list.interface.ts      # từ base/interfaces/list.interface.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── list-query.helper.ts   # từ base/utils/list-query.helper.ts
│   │   ├── pagination.helper.ts   # từ base/utils/pagination.helper.ts
│   │   ├── response-ref.helper.ts # từ base/utils/response-ref.helper.ts
│   │   └── index.ts
│   └── index.ts                   # Export tất cả từ core
│
├── auth/                           # 🔐 Authentication & Authorization
│   ├── services/
│   │   ├── auth.service.ts        # từ services/auth.service.ts
│   │   └── index.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts      # từ guards/jwt-auth.guard.ts
│   │   ├── rbac.guard.ts          # từ guards/rbac.guard.ts
│   │   └── index.ts
│   ├── decorators/
│   │   ├── rbac.decorators.ts     # từ decorators/rbac.decorators.ts
│   │   └── index.ts
│   ├── interfaces/
│   │   ├── auth-user.interface.ts # từ interfaces/auth-user.interface.ts
│   │   ├── authenticated-request.interface.ts # từ interfaces/authenticated-request.interface.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── auth.util.ts           # từ utils/auth.util.ts
│   │   └── index.ts
│   └── index.ts                   # Export tất cả từ auth
│
├── cache/                          # 💾 Caching functionality
│   ├── services/
│   │   ├── cache.service.ts       # từ services/cache.service.ts
│   │   └── index.ts
│   ├── interceptors/
│   │   ├── cache.interceptor.ts   # từ interceptors/cache.interceptor.ts
│   │   └── index.ts
│   ├── decorators/
│   │   ├── cacheable.decorator.ts # từ decorators/cacheable.decorator.ts
│   │   └── index.ts
│   └── index.ts                   # Export tất cả từ cache
│
├── file/                           # 📁 File handling
│   ├── utils/
│   │   ├── file-path.util.ts      # từ utils/file-path.util.ts
│   │   └── index.ts
│   ├── interceptors/
│   │   ├── file-path.interceptor.ts # từ interceptors/file-path.interceptor.ts
│   │   └── index.ts
│   └── index.ts                   # Export tất cả từ file
│
├── http/                           # 🌐 HTTP layer (filters, interceptors, middleware, pipes)
│   ├── filters/
│   │   ├── http-exception.filter.ts   # từ filters/http-exception.filter.ts
│   │   ├── query-failed.filter.ts     # từ filters/query-failed.filter.ts
│   │   └── index.ts
│   ├── interceptors/
│   │   ├── logging.interceptor.ts     # từ interceptors/logging.interceptor.ts
│   │   ├── transform.interceptor.ts   # từ interceptors/transform.interceptor.ts
│   │   ├── timeout.interceptor.ts     # từ interceptors/timeout.interceptor.ts
│   │   ├── group.interceptor.ts       # từ interceptors/group.interceptor.ts
│   │   └── index.ts
│   ├── middlewares/
│   │   ├── request-context.middleware.ts # từ middlewares/request-context.middleware.ts
│   │   └── index.ts
│   ├── pipes/
│   │   ├── parse-bigint.pipe.ts       # từ pipes/parse-bigint.pipe.ts
│   │   └── index.ts
│   └── index.ts                       # Export tất cả từ http
│
├── shared/                         # 🔧 Shared utilities & decorators
│   ├── decorators/
│   │   ├── log-request.decorator.ts   # từ decorators/log-request.decorator.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── dataloader.util.ts         # từ utils/dataloader.util.ts
│   │   ├── group-ownership.util.ts    # từ utils/group-ownership.util.ts
│   │   ├── request-context.util.ts    # từ utils/request-context.util.ts
│   │   ├── response.util.ts           # từ utils/response.util.ts
│   │   └── index.ts
│   ├── validators/
│   │   ├── match.decorator.ts         # từ validators/match.decorator.ts
│   │   └── index.ts
│   ├── exceptions/
│   │   ├── business.exception.ts      # từ exceptions/business.exception.ts
│   │   └── index.ts
│   └── index.ts                       # Export tất cả từ shared
│
└── common.module.ts                    # Module definition
```

---

## 📋 Bảng So Sánh

| Tiêu Chí | Trước | Sau | Cải Thiện |
|----------|-------|-----|-----------|
| **Số thư mục cấp 1** | 12 | 6 | ✅ -50% |
| **Số thư mục tổng** | 16 | 29 | ⚠️ +81% |
| **Độ sâu tối đa** | 3 cấp | 3 cấp | ➖ Giữ nguyên |
| **Thư mục có 1-2 file** | 7 | 0 | ✅ -100% |
| **Tính tập trung chức năng** | Thấp | Cao | ✅ Tốt hơn |
| **Tính rõ ràng loại file** | Thấp | Cao | ✅ Tốt hơn |
| **Dễ mở rộng** | Trung bình | Cao | ✅ Tốt hơn |

**Giải thích:**
- ✅ **Giảm 50% thư mục cấp 1** - Dễ navigate hơn
- ⚠️ **Tăng tổng số thư mục** - Nhưng có tổ chức rõ ràng hơn (mỗi thư mục có mục đích cụ thể)
- ✅ **Không còn thư mục nhỏ lẻ** - Mọi thư mục đều có ít nhất 1 index.ts + files
- ✅ **Cấu trúc nhất quán** - Mọi feature đều theo pattern: feature/type/file

---

## 🎯 Lợi Ích Của Cấu Trúc Mới

### 1. **Dễ Tìm Kiếm - Hai Chiều**
**Tìm theo chức năng:**
- Muốn tìm code về auth? → Vào thư mục `auth/`
- Muốn tìm code về cache? → Vào thư mục `cache/`
- Muốn tìm base classes? → Vào thư mục `core/`

**Tìm theo loại file:**
- Muốn tìm tất cả guards? → Xem `auth/guards/`, `core/` không có guards
- Muốn tìm tất cả services? → Xem `core/services/`, `auth/services/`, `cache/services/`
- Muốn tìm tất cả interceptors? → Xem `cache/interceptors/`, `file/interceptors/`, `http/interceptors/`

### 2. **Tăng Tính Cohesion & Separation of Concerns**
- **Cohesion cao:** Các file liên quan về mặt nghiệp vụ được đặt gần nhau
- **Separation rõ ràng:** Mỗi loại file (service, guard, decorator) có thư mục riêng
- **Dễ dàng refactor:** Muốn thay đổi auth? Chỉ cần vào `auth/`

### 3. **Pattern Nhất Quán - Dễ Mở Rộng**
Mọi feature đều theo cùng một pattern:
```
feature/
├── services/
├── guards/
├── decorators/
├── utils/
├── interfaces/
├── interceptors/
└── index.ts
```

Khi thêm feature mới (ví dụ: `notification/`), chỉ cần:
1. Tạo thư mục `notification/`
2. Tạo các thư mục con theo nhu cầu (services, utils, interfaces, etc.)
3. Tạo `index.ts` để export

### 4. **Import Paths Rõ Ràng**
```typescript
// Trước - Không rõ file thuộc chức năng gì
import { AuthService } from '@/common/services/auth.service';
import { CacheService } from '@/common/services/cache.service';

// Sau - Rõ ràng về chức năng VÀ loại file
import { AuthService } from '@/common/auth/services';
import { CacheService } from '@/common/cache/services';

// Hoặc import từ root của feature
import { AuthService, JwtAuthGuard, RbacGuard } from '@/common/auth';
import { CacheService, CacheInterceptor } from '@/common/cache';
```

### 5. **Dễ Dàng Code Review**
- Reviewer biết ngay file thuộc feature nào
- Dễ đánh giá impact của thay đổi
- Dễ kiểm tra xem có vi phạm separation of concerns không

### 6. **IDE Support Tốt Hơn**
- Auto-complete theo cả feature và type
- Dễ dàng navigate giữa các file liên quan
- Folder structure rõ ràng trong file explorer

---

## 🚀 Kế Hoạch Migration

### **Phase 1: Tạo Cấu Trúc Mới**
```bash
# Core
mkdir -p src/common/core/services
mkdir -p src/common/core/repositories
mkdir -p src/common/core/interfaces
mkdir -p src/common/core/utils

# Auth
mkdir -p src/common/auth/services
mkdir -p src/common/auth/guards
mkdir -p src/common/auth/decorators
mkdir -p src/common/auth/interfaces
mkdir -p src/common/auth/utils

# Cache
mkdir -p src/common/cache/services
mkdir -p src/common/cache/interceptors
mkdir -p src/common/cache/decorators

# File
mkdir -p src/common/file/utils
mkdir -p src/common/file/interceptors

# HTTP
mkdir -p src/common/http/filters
mkdir -p src/common/http/interceptors
mkdir -p src/common/http/middlewares
mkdir -p src/common/http/pipes

# Shared
mkdir -p src/common/shared/decorators
mkdir -p src/common/shared/utils
mkdir -p src/common/shared/validators
mkdir -p src/common/shared/exceptions
```

### **Phase 2: Di Chuyển Files**

#### **2.1. Core (9 files)**
```bash
# Services
mv src/common/base/services/base.service.ts src/common/core/services/
mv src/common/base/services/base-content.service.ts src/common/core/services/

# Repositories
mv src/common/base/repository/prisma.repository.ts src/common/core/repositories/
mv src/common/base/repository/repository.interface.ts src/common/core/repositories/

# Interfaces
mv src/common/base/interfaces/list.interface.ts src/common/core/interfaces/

# Utils
mv src/common/base/utils/list-query.helper.ts src/common/core/utils/
mv src/common/base/utils/pagination.helper.ts src/common/core/utils/
mv src/common/base/utils/response-ref.helper.ts src/common/core/utils/
```

#### **2.2. Auth (7 files)**
```bash
# Services
mv src/common/services/auth.service.ts src/common/auth/services/

# Guards
mv src/common/guards/jwt-auth.guard.ts src/common/auth/guards/
mv src/common/guards/rbac.guard.ts src/common/auth/guards/

# Decorators
mv src/common/decorators/rbac.decorators.ts src/common/auth/decorators/

# Interfaces
mv src/common/interfaces/auth-user.interface.ts src/common/auth/interfaces/
mv src/common/interfaces/authenticated-request.interface.ts src/common/auth/interfaces/

# Utils
mv src/common/utils/auth.util.ts src/common/auth/utils/
```

#### **2.3. Cache (3 files)**
```bash
# Services
mv src/common/services/cache.service.ts src/common/cache/services/

# Interceptors
mv src/common/interceptors/cache.interceptor.ts src/common/cache/interceptors/

# Decorators
mv src/common/decorators/cacheable.decorator.ts src/common/cache/decorators/
```

#### **2.4. File (2 files)**
```bash
# Utils
mv src/common/utils/file-path.util.ts src/common/file/utils/

# Interceptors
mv src/common/interceptors/file-path.interceptor.ts src/common/file/interceptors/
```

#### **2.5. HTTP (9 files)**
```bash
# Filters
mv src/common/filters/http-exception.filter.ts src/common/http/filters/
mv src/common/filters/query-failed.filter.ts src/common/http/filters/

# Interceptors
mv src/common/interceptors/logging.interceptor.ts src/common/http/interceptors/
mv src/common/interceptors/transform.interceptor.ts src/common/http/interceptors/
mv src/common/interceptors/timeout.interceptor.ts src/common/http/interceptors/
mv src/common/interceptors/group.interceptor.ts src/common/http/interceptors/

# Middlewares
mv src/common/middlewares/request-context.middleware.ts src/common/http/middlewares/

# Pipes
mv src/common/pipes/parse-bigint.pipe.ts src/common/http/pipes/
```

#### **2.6. Shared (9 files)**
```bash
# Decorators
mv src/common/decorators/log-request.decorator.ts src/common/shared/decorators/

# Utils
mv src/common/utils/dataloader.util.ts src/common/shared/utils/
mv src/common/utils/group-ownership.util.ts src/common/shared/utils/
mv src/common/utils/request-context.util.ts src/common/shared/utils/
mv src/common/utils/response.util.ts src/common/shared/utils/

# Validators
mv src/common/validators/match.decorator.ts src/common/shared/validators/

# Exceptions
mv src/common/exceptions/business.exception.ts src/common/shared/exceptions/
```

### **Phase 3: Tạo Index Files**

Tạo `index.ts` cho mỗi thư mục con và thư mục chính để dễ dàng import.

### **Phase 4: Cập Nhật Imports**

Sử dụng Find & Replace trong toàn bộ codebase:

```typescript
// Ví dụ các pattern cần thay đổi:

// Auth
'@/common/services/auth.service' → '@/common/auth/services'
'@/common/guards/jwt-auth.guard' → '@/common/auth/guards'
'@/common/guards/rbac.guard' → '@/common/auth/guards'
'@/common/decorators/rbac.decorators' → '@/common/auth/decorators'
'@/common/interfaces/auth-user.interface' → '@/common/auth/interfaces'
'@/common/utils/auth.util' → '@/common/auth/utils'

// Cache
'@/common/services/cache.service' → '@/common/cache/services'
'@/common/interceptors/cache.interceptor' → '@/common/cache/interceptors'
'@/common/decorators/cacheable.decorator' → '@/common/cache/decorators'

// Core/Base
'@/common/base/services/base.service' → '@/common/core/services'
'@/common/base/services/base-content.service' → '@/common/core/services'
'@/common/base/repository/prisma.repository' → '@/common/core/repositories'
'@/common/base/repository/repository.interface' → '@/common/core/repositories'
'@/common/base/interfaces/list.interface' → '@/common/core/interfaces'
'@/common/base/utils/pagination.helper' → '@/common/core/utils'

// HTTP
'@/common/filters/http-exception.filter' → '@/common/http/filters'
'@/common/interceptors/logging.interceptor' → '@/common/http/interceptors'
'@/common/middlewares/request-context.middleware' → '@/common/http/middlewares'
'@/common/pipes/parse-bigint.pipe' → '@/common/http/pipes'

// Shared
'@/common/decorators/log-request.decorator' → '@/common/shared/decorators'
'@/common/utils/dataloader.util' → '@/common/shared/utils'
'@/common/validators/match.decorator' → '@/common/shared/validators'
'@/common/exceptions/business.exception' → '@/common/shared/exceptions'
```

### **Phase 5: Xóa Thư Mục Cũ**
```bash
# Sau khi đã verify mọi thứ hoạt động
rm -rf src/common/base
rm -rf src/common/guards
rm -rf src/common/services
rm -rf src/common/interfaces
rm -rf src/common/decorators
rm -rf src/common/filters
rm -rf src/common/interceptors
rm -rf src/common/middlewares
rm -rf src/common/pipes
rm -rf src/common/utils
rm -rf src/common/validators
rm -rf src/common/exceptions
```

### **Phase 6: Testing**
- Chạy `npm run build` để kiểm tra compile
- Chạy `npm run test` để kiểm tra unit tests
- Chạy `npm run start:dev` để kiểm tra runtime
- Kiểm tra tất cả imports đã được cập nhật đúng

---

## 📝 Checklist Thực Hiện

- [ ] Backup code hiện tại
- [ ] Tạo branch mới cho refactoring: `git checkout -b refactor/common-directory-structure`
- [ ] Tạo cấu trúc thư mục mới (Phase 1)
- [ ] Di chuyển files theo từng nhóm (Phase 2)
  - [ ] Core files
  - [ ] Auth files
  - [ ] Cache files
  - [ ] File handling files
  - [ ] HTTP files
  - [ ] Shared files
- [ ] Tạo index.ts cho tất cả thư mục (Phase 3)
- [ ] Cập nhật imports trong toàn bộ codebase (Phase 4)
- [ ] Cập nhật `common.module.ts` nếu cần
- [ ] Kiểm tra build: `npm run build`
- [ ] Kiểm tra tests: `npm run test`
- [ ] Kiểm tra runtime: `npm run start:dev`
- [ ] Xóa thư mục cũ (Phase 5)
- [ ] Commit: `git commit -m "refactor: reorganize common directory structure"`
- [ ] Tạo PR và review
- [ ] Merge vào main branch

---

## ⚠️ Lưu Ý Quan Trọng

1. **Không làm tất cả một lúc** - Chia nhỏ thành nhiều commits theo từng phase
2. **Kiểm tra kỹ imports** - Đảm bảo không có broken imports
3. **Giữ nguyên tên file** - Chỉ thay đổi vị trí, không đổi tên
4. **Tạo index.ts đầy đủ** - Để dễ dàng import từ bên ngoài
5. **Test sau mỗi phase** - Đảm bảo không break code
6. **Update documentation** - Cập nhật README nếu có
7. **Sử dụng Git** - Để dễ dàng rollback nếu có vấn đề

---

## 🎨 Ví Dụ Index Files

### `core/index.ts`
```typescript
// Export all from core
export * from './services';
export * from './repositories';
export * from './interfaces';
export * from './utils';
```

### `core/services/index.ts`
```typescript
export * from './base.service';
export * from './base-content.service';
```

### `core/repositories/index.ts`
```typescript
export * from './prisma.repository';
export * from './repository.interface';
```

### `core/interfaces/index.ts`
```typescript
export * from './list.interface';
```

### `core/utils/index.ts`
```typescript
export * from './list-query.helper';
export * from './pagination.helper';
export * from './response-ref.helper';
```

---

### `auth/index.ts`
```typescript
// Export all from auth
export * from './services';
export * from './guards';
export * from './decorators';
export * from './interfaces';
export * from './utils';
```

### `auth/services/index.ts`
```typescript
export * from './auth.service';
```

### `auth/guards/index.ts`
```typescript
export * from './jwt-auth.guard';
export * from './rbac.guard';
```

### `auth/decorators/index.ts`
```typescript
export * from './rbac.decorators';
```

### `auth/interfaces/index.ts`
```typescript
export * from './auth-user.interface';
export * from './authenticated-request.interface';
```

### `auth/utils/index.ts`
```typescript
export * from './auth.util';
```

---

### `cache/index.ts`
```typescript
// Export all from cache
export * from './services';
export * from './interceptors';
export * from './decorators';
```

### `cache/services/index.ts`
```typescript
export * from './cache.service';
```

### `cache/interceptors/index.ts`
```typescript
export * from './cache.interceptor';
```

### `cache/decorators/index.ts`
```typescript
export * from './cacheable.decorator';
```

---

### `http/index.ts`
```typescript
// Export all from http
export * from './filters';
export * from './interceptors';
export * from './middlewares';
export * from './pipes';
```

### `http/filters/index.ts`
```typescript
export * from './http-exception.filter';
export * from './query-failed.filter';
```

### `http/interceptors/index.ts`
```typescript
export * from './logging.interceptor';
export * from './transform.interceptor';
export * from './timeout.interceptor';
export * from './group.interceptor';
```

### `http/middlewares/index.ts`
```typescript
export * from './request-context.middleware';
```

### `http/pipes/index.ts`
```typescript
export * from './parse-bigint.pipe';
```

---

### `shared/index.ts`
```typescript
// Export all from shared
export * from './decorators';
export * from './utils';
export * from './validators';
export * from './exceptions';
```

### `shared/decorators/index.ts`
```typescript
export * from './log-request.decorator';
```

### `shared/utils/index.ts`
```typescript
export * from './dataloader.util';
export * from './group-ownership.util';
export * from './request-context.util';
export * from './response.util';
```

### `shared/validators/index.ts`
```typescript
export * from './match.decorator';
```

### `shared/exceptions/index.ts`
```typescript
export * from './business.exception';
```

---

## 📊 Tổng Kết

Cấu trúc mới sẽ:
- ✅ **Gọn gàng hơn** - Giảm 50% thư mục cấp 1 (từ 12 xuống 6)
- ✅ **Rõ ràng hơn** - Vừa gom theo chức năng, vừa phân loại theo type
- ✅ **Dễ maintain hơn** - Mỗi feature có cấu trúc nhất quán
- ✅ **Dễ mở rộng hơn** - Pattern rõ ràng cho features mới
- ✅ **Developer-friendly** - Dễ tìm kiếm theo cả 2 chiều (feature + type)
- ✅ **Không còn thư mục nhỏ lẻ** - Mọi thư mục đều có mục đích rõ ràng
- ✅ **Import paths rõ ràng** - Biết ngay file thuộc feature nào và loại gì

**Thời gian ước tính:** 3-4 giờ cho toàn bộ refactoring + testing

---

## 💡 Gợi Ý Tiếp Theo

Sau khi hoàn thành refactoring thư mục `src/common`, bạn có thể:

1. **Áp dụng pattern tương tự cho `src/modules`**
   - Mỗi module có thể có cấu trúc: `controllers/`, `services/`, `dtos/`, `entities/`, etc.

2. **Tạo documentation**
   - Viết README.md cho từng feature trong `common/`
   - Giải thích cách sử dụng và best practices

3. **Thiết lập linting rules**
   - Đảm bảo imports tuân theo pattern mới
   - Ngăn chặn circular dependencies

4. **Code review guidelines**
   - Hướng dẫn team về cấu trúc mới
   - Checklist khi thêm feature mới
