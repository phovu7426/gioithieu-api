# Kế Hoạch Triển Khai Cấp 3 - Full Abstraction (Enterprise Level)

## 📋 Tổng Quan

**Mục tiêu**: Xây dựng kiến trúc hoàn toàn độc lập với ORM, dễ dàng thay đổi database/ORM mà không ảnh hưởng đến Business Logic.

**Thời gian dự kiến**: 6-8 tuần (cho 28 modules hiện tại)

**Nguyên tắc cốt lõi**:
1. ✅ **Domain Models** không phụ thuộc vào Prisma/ORM
2. ✅ **Services** chỉ biết Domain Models và Repository Interfaces
3. ✅ **Repository Interfaces** 100% database-agnostic
4. ✅ **Repository Implementations** có Mapper layer để convert giữa Domain ↔ Prisma

---

## 🏗️ Kiến Trúc Mới

```
src/
├── domain/                          # ← MỚI: Domain Layer (100% Clean)
│   ├── models/                      # Domain Models (không phụ thuộc ORM)
│   │   ├── certificate.model.ts
│   │   ├── post.model.ts
│   │   └── ...
│   ├── repositories/                # Repository Interfaces
│   │   ├── certificate.repository.interface.ts
│   │   ├── post.repository.interface.ts
│   │   └── ...
│   ├── value-objects/               # Value Objects (Email, Money, etc.)
│   │   ├── email.vo.ts
│   │   └── status.vo.ts
│   └── exceptions/                  # Domain Exceptions
│       ├── entity-not-found.exception.ts
│       └── validation.exception.ts
│
├── application/                     # ← REFACTOR: Application Layer
│   ├── dtos/                        # DTOs cho API
│   │   ├── certificate/
│   │   │   ├── create-certificate.dto.ts
│   │   │   ├── update-certificate.dto.ts
│   │   │   └── certificate-response.dto.ts
│   │   └── ...
│   └── services/                    # Application Services (sử dụng Domain)
│       └── (giữ nguyên cấu trúc modules hiện tại)
│
├── infrastructure/                  # ← MỚI: Infrastructure Layer
│   ├── persistence/
│   │   ├── prisma/                  # Prisma Implementation
│   │   │   ├── repositories/
│   │   │   │   ├── certificate.prisma.repository.ts
│   │   │   │   └── ...
│   │   │   ├── mappers/             # Prisma ↔ Domain Mappers
│   │   │   │   ├── certificate.mapper.ts
│   │   │   │   └── ...
│   │   │   └── entities/            # Prisma Entities (generated)
│   │   │       └── (từ @prisma/client)
│   │   │
│   │   └── typeorm/                 # (Tương lai) TypeORM Implementation
│   │       └── repositories/
│   │
│   ├── cache/                       # Redis, Memory Cache
│   └── external-services/           # Third-party APIs
│
├── modules/                         # ← REFACTOR: Presentation Layer
│   └── (Controllers + Module configs)
│
└── common/                          # ← UPDATE: Shared utilities
    └── base/
        ├── domain/                  # Base Domain classes
        │   ├── entity.base.ts
        │   ├── value-object.base.ts
        │   └── aggregate-root.base.ts
        └── repository/              # Base Repository interfaces
            └── base.repository.interface.ts
```

---

## 📅 Kế Hoạch Thực Hiện Chi Tiết

### **GIAI ĐOẠN 1: Xây Dựng Foundation (Tuần 1-2)**

#### **Tuần 1: Tạo Base Classes & Interfaces**

##### **Ngày 1-2: Base Domain Classes**
- [ ] Tạo `src/common/base/domain/entity.base.ts`
  ```typescript
  export abstract class Entity<T> {
    protected readonly _id: T;
    
    constructor(id: T) {
      this._id = id;
    }
    
    get id(): T {
      return this._id;
    }
    
    equals(entity: Entity<T>): boolean {
      return this._id === entity._id;
    }
  }
  ```

- [ ] Tạo `src/common/base/domain/value-object.base.ts`
  ```typescript
  export abstract class ValueObject<T> {
    protected readonly props: T;
    
    constructor(props: T) {
      this.props = Object.freeze(props);
    }
    
    equals(vo: ValueObject<T>): boolean {
      return JSON.stringify(this.props) === JSON.stringify(vo.props);
    }
  }
  ```

- [ ] Tạo `src/common/base/domain/aggregate-root.base.ts`
  ```typescript
  export abstract class AggregateRoot<T> extends Entity<T> {
    // Có thể thêm Domain Events sau này
  }
  ```

##### **Ngày 3-4: Base Repository Interface**
- [ ] Tạo `src/common/base/repository/base.repository.interface.ts`
  ```typescript
  export interface IBaseRepository<T, ID = bigint> {
    findById(id: ID): Promise<T | null>;
    findAll(): Promise<T[]>;
    save(entity: T): Promise<T>;
    update(entity: T): Promise<T>;
    delete(id: ID): Promise<boolean>;
    exists(id: ID): Promise<boolean>;
  }
  ```

##### **Ngày 5: Domain Exceptions**
- [ ] Tạo `src/domain/exceptions/entity-not-found.exception.ts`
- [ ] Tạo `src/domain/exceptions/validation.exception.ts`
- [ ] Tạo `src/domain/exceptions/domain.exception.ts` (base)

---

#### **Tuần 2: Tạo Common Value Objects & Utilities**

##### **Ngày 1-2: Common Value Objects**
- [ ] `src/domain/value-objects/email.vo.ts`
  ```typescript
  export class Email extends ValueObject<{ value: string }> {
    private constructor(props: { value: string }) {
      super(props);
    }
    
    static create(email: string): Email {
      if (!this.isValid(email)) {
        throw new ValidationException('Invalid email format');
      }
      return new Email({ value: email });
    }
    
    private static isValid(email: string): boolean {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    get value(): string {
      return this.props.value;
    }
  }
  ```

- [ ] `src/domain/value-objects/status.vo.ts`
- [ ] `src/domain/value-objects/date-range.vo.ts`

##### **Ngày 3-5: Base Mapper Interface**
- [ ] Tạo `src/infrastructure/persistence/mapper.interface.ts`
  ```typescript
  export interface IMapper<DomainEntity, PersistenceEntity> {
    toDomain(raw: PersistenceEntity): DomainEntity;
    toPersistence(domain: DomainEntity): PersistenceEntity;
  }
  ```

- [ ] Tạo helper utilities cho mapping (BigInt, Date, etc.)

---

### **GIAI ĐOẠN 2: Pilot Module - Certificate (Tuần 3-4)**

> **Mục tiêu**: Hoàn thành 1 module mẫu để làm template cho các module khác

#### **Tuần 3: Certificate Domain Layer**

##### **Ngày 1-2: Certificate Domain Model**
- [ ] Tạo `src/domain/models/certificate.model.ts`
  ```typescript
  import { AggregateRoot } from '@/common/base/domain/aggregate-root.base';
  import { Status } from '@/domain/value-objects/status.vo';
  
  export interface ICertificateProps {
    name: string;
    description?: string;
    imageUrl?: string;
    status: Status;
    sortOrder: number;
    projectId?: bigint;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  }
  
  export class Certificate extends AggregateRoot<bigint> {
    private props: ICertificateProps;
    
    private constructor(id: bigint, props: ICertificateProps) {
      super(id);
      this.props = props;
    }
    
    static create(id: bigint, props: ICertificateProps): Certificate {
      // Validation logic
      if (!props.name || props.name.trim().length === 0) {
        throw new ValidationException('Certificate name is required');
      }
      
      return new Certificate(id, props);
    }
    
    // Getters
    get name(): string {
      return this.props.name;
    }
    
    get status(): Status {
      return this.props.status;
    }
    
    // Business methods
    isActive(): boolean {
      return this.props.status.isActive() && !this.props.deletedAt;
    }
    
    activate(): void {
      this.props.status = Status.active();
      this.props.updatedAt = new Date();
    }
    
    deactivate(): void {
      this.props.status = Status.inactive();
      this.props.updatedAt = new Date();
    }
    
    softDelete(): void {
      this.props.deletedAt = new Date();
    }
    
    // For updates
    updateDetails(name: string, description?: string): void {
      if (!name || name.trim().length === 0) {
        throw new ValidationException('Certificate name is required');
      }
      this.props.name = name;
      this.props.description = description;
      this.props.updatedAt = new Date();
    }
  }
  ```

##### **Ngày 3: Certificate Repository Interface**
- [ ] Tạo `src/domain/repositories/certificate.repository.interface.ts`
  ```typescript
  import { IBaseRepository } from '@/common/base/repository/base.repository.interface';
  import { Certificate } from '@/domain/models/certificate.model';
  
  export interface ICertificateRepository extends IBaseRepository<Certificate, bigint> {
    // Domain-specific queries
    findActive(): Promise<Certificate[]>;
    findByProject(projectId: bigint): Promise<Certificate[]>;
    findByStatus(status: string): Promise<Certificate[]>;
    
    // Pagination (domain-level)
    findWithPagination(options: {
      page: number;
      limit: number;
      status?: string;
      search?: string;
    }): Promise<{
      items: Certificate[];
      total: number;
      page: number;
      limit: number;
    }>;
  }
  ```

##### **Ngày 4-5: Certificate DTOs**
- [ ] Tạo `src/application/dtos/certificate/create-certificate.dto.ts`
- [ ] Tạo `src/application/dtos/certificate/update-certificate.dto.ts`
- [ ] Tạo `src/application/dtos/certificate/certificate-response.dto.ts`
  ```typescript
  export class CertificateResponseDto {
    id: string; // Convert bigint to string for JSON
    name: string;
    description?: string;
    imageUrl?: string;
    status: string;
    sortOrder: number;
    projectId?: string;
    createdAt: string;
    updatedAt: string;
    
    static fromDomain(certificate: Certificate): CertificateResponseDto {
      return {
        id: certificate.id.toString(),
        name: certificate.name,
        description: certificate.description,
        imageUrl: certificate.imageUrl,
        status: certificate.status.value,
        sortOrder: certificate.sortOrder,
        projectId: certificate.projectId?.toString(),
        createdAt: certificate.createdAt.toISOString(),
        updatedAt: certificate.updatedAt.toISOString(),
      };
    }
  }
  ```

---

#### **Tuần 4: Certificate Infrastructure Layer**

##### **Ngày 1-2: Certificate Mapper**
- [ ] Tạo `src/infrastructure/persistence/prisma/mappers/certificate.mapper.ts`
  ```typescript
  import { Injectable } from '@nestjs/common';
  import { Certificate as PrismaCertificate } from '@prisma/client';
  import { Certificate } from '@/domain/models/certificate.model';
  import { Status } from '@/domain/value-objects/status.vo';
  import { IMapper } from '../mapper.interface';
  
  @Injectable()
  export class CertificateMapper implements IMapper<Certificate, PrismaCertificate> {
    toDomain(raw: PrismaCertificate): Certificate {
      return Certificate.create(raw.id, {
        name: raw.name,
        description: raw.description,
        imageUrl: raw.image_url,
        status: Status.fromString(raw.status),
        sortOrder: Number(raw.sort_order),
        projectId: raw.project_id,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
        deletedAt: raw.deleted_at,
      });
    }
    
    toPersistence(domain: Certificate): any {
      return {
        id: domain.id,
        name: domain.name,
        description: domain.description,
        image_url: domain.imageUrl,
        status: domain.status.value,
        sort_order: domain.sortOrder,
        project_id: domain.projectId,
        created_at: domain.createdAt,
        updated_at: domain.updatedAt,
        deleted_at: domain.deletedAt,
      };
    }
    
    // For create operations (without id)
    toCreateInput(domain: Partial<Certificate>): any {
      return {
        name: domain.name,
        description: domain.description,
        image_url: domain.imageUrl,
        status: domain.status?.value || 'active',
        sort_order: domain.sortOrder || 0,
        project_id: domain.projectId,
      };
    }
    
    // For update operations
    toUpdateInput(domain: Partial<Certificate>): any {
      const data: any = {};
      if (domain.name !== undefined) data.name = domain.name;
      if (domain.description !== undefined) data.description = domain.description;
      if (domain.imageUrl !== undefined) data.image_url = domain.imageUrl;
      if (domain.status !== undefined) data.status = domain.status.value;
      if (domain.sortOrder !== undefined) data.sort_order = domain.sortOrder;
      data.updated_at = new Date();
      return data;
    }
  }
  ```

##### **Ngày 3-4: Certificate Prisma Repository**
- [ ] Tạo `src/infrastructure/persistence/prisma/repositories/certificate.prisma.repository.ts`
  ```typescript
  import { Injectable } from '@nestjs/common';
  import { PrismaService } from '@/core/database/prisma/prisma.service';
  import { ICertificateRepository } from '@/domain/repositories/certificate.repository.interface';
  import { Certificate } from '@/domain/models/certificate.model';
  import { CertificateMapper } from '../mappers/certificate.mapper';
  import { EntityNotFoundException } from '@/domain/exceptions/entity-not-found.exception';
  
  @Injectable()
  export class CertificatePrismaRepository implements ICertificateRepository {
    constructor(
      private readonly prisma: PrismaService,
      private readonly mapper: CertificateMapper,
    ) {}
    
    async findById(id: bigint): Promise<Certificate | null> {
      const raw = await this.prisma.certificate.findFirst({
        where: { id, deleted_at: null },
      });
      return raw ? this.mapper.toDomain(raw) : null;
    }
    
    async findAll(): Promise<Certificate[]> {
      const rawList = await this.prisma.certificate.findMany({
        where: { deleted_at: null },
        orderBy: { sort_order: 'asc' },
      });
      return rawList.map(raw => this.mapper.toDomain(raw));
    }
    
    async findActive(): Promise<Certificate[]> {
      const rawList = await this.prisma.certificate.findMany({
        where: {
          status: 'active',
          deleted_at: null,
        },
        orderBy: { sort_order: 'asc' },
      });
      return rawList.map(raw => this.mapper.toDomain(raw));
    }
    
    async findByProject(projectId: bigint): Promise<Certificate[]> {
      const rawList = await this.prisma.certificate.findMany({
        where: {
          project_id: projectId,
          deleted_at: null,
        },
        orderBy: { sort_order: 'asc' },
      });
      return rawList.map(raw => this.mapper.toDomain(raw));
    }
    
    async findByStatus(status: string): Promise<Certificate[]> {
      const rawList = await this.prisma.certificate.findMany({
        where: {
          status,
          deleted_at: null,
        },
        orderBy: { sort_order: 'asc' },
      });
      return rawList.map(raw => this.mapper.toDomain(raw));
    }
    
    async findWithPagination(options: {
      page: number;
      limit: number;
      status?: string;
      search?: string;
    }): Promise<{
      items: Certificate[];
      total: number;
      page: number;
      limit: number;
    }> {
      const { page, limit, status, search } = options;
      const skip = (page - 1) * limit;
      
      const where: any = { deleted_at: null };
      if (status) where.status = status;
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { description: { contains: search } },
        ];
      }
      
      const [rawList, total] = await Promise.all([
        this.prisma.certificate.findMany({
          where,
          orderBy: { sort_order: 'asc' },
          skip,
          take: limit,
        }),
        this.prisma.certificate.count({ where }),
      ]);
      
      return {
        items: rawList.map(raw => this.mapper.toDomain(raw)),
        total,
        page,
        limit,
      };
    }
    
    async save(entity: Certificate): Promise<Certificate> {
      const data = this.mapper.toCreateInput(entity);
      const raw = await this.prisma.certificate.create({ data });
      return this.mapper.toDomain(raw);
    }
    
    async update(entity: Certificate): Promise<Certificate> {
      const data = this.mapper.toUpdateInput(entity);
      const raw = await this.prisma.certificate.update({
        where: { id: entity.id },
        data,
      });
      return this.mapper.toDomain(raw);
    }
    
    async delete(id: bigint): Promise<boolean> {
      try {
        await this.prisma.certificate.update({
          where: { id },
          data: { deleted_at: new Date() },
        });
        return true;
      } catch (error) {
        return false;
      }
    }
    
    async exists(id: bigint): Promise<boolean> {
      const count = await this.prisma.certificate.count({
        where: { id, deleted_at: null },
      });
      return count > 0;
    }
  }
  ```

##### **Ngày 5: Certificate Repository Module**
- [ ] Tạo `src/infrastructure/persistence/prisma/repositories/certificate-repository.module.ts`
  ```typescript
  import { Module } from '@nestjs/common';
  import { CertificatePrismaRepository } from './certificate.prisma.repository';
  import { CertificateMapper } from '../mappers/certificate.mapper';
  import { PrismaModule } from '@/core/database/prisma/prisma.module';
  
  @Module({
    imports: [PrismaModule],
    providers: [
      CertificateMapper,
      {
        provide: 'ICertificateRepository',
        useClass: CertificatePrismaRepository,
      },
    ],
    exports: ['ICertificateRepository'],
  })
  export class CertificateRepositoryModule {}
  ```

---

### **GIAI ĐOẠN 3: Refactor Certificate Service & Controller (Tuần 5)**

#### **Ngày 1-3: Refactor Certificate Service**
- [ ] Update `src/modules/introduction/certificate/admin/services/certificate.service.ts`
  ```typescript
  import { Injectable, Inject } from '@nestjs/common';
  import { ICertificateRepository } from '@/domain/repositories/certificate.repository.interface';
  import { Certificate } from '@/domain/models/certificate.model';
  import { CreateCertificateDto } from '@/application/dtos/certificate/create-certificate.dto';
  import { UpdateCertificateDto } from '@/application/dtos/certificate/update-certificate.dto';
  import { CertificateResponseDto } from '@/application/dtos/certificate/certificate-response.dto';
  import { EntityNotFoundException } from '@/domain/exceptions/entity-not-found.exception';
  import { Status } from '@/domain/value-objects/status.vo';
  
  @Injectable()
  export class AdminCertificateService {
    constructor(
      @Inject('ICertificateRepository')
      private readonly repository: ICertificateRepository,
    ) {}
    
    async getList(options: {
      page: number;
      limit: number;
      status?: string;
      search?: string;
    }): Promise<{
      data: CertificateResponseDto[];
      meta: any;
    }> {
      const result = await this.repository.findWithPagination(options);
      
      return {
        data: result.items.map(cert => CertificateResponseDto.fromDomain(cert)),
        meta: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          lastPage: Math.ceil(result.total / result.limit),
        },
      };
    }
    
    async getById(id: bigint): Promise<CertificateResponseDto> {
      const certificate = await this.repository.findById(id);
      if (!certificate) {
        throw new EntityNotFoundException('Certificate', id.toString());
      }
      return CertificateResponseDto.fromDomain(certificate);
    }
    
    async create(dto: CreateCertificateDto): Promise<CertificateResponseDto> {
      // Validate project exists if projectId provided
      if (dto.projectId) {
        // ... validation logic
      }
      
      const certificate = Certificate.create(0n, { // ID will be generated by DB
        name: dto.name,
        description: dto.description,
        imageUrl: dto.imageUrl,
        status: Status.fromString(dto.status || 'active'),
        sortOrder: dto.sortOrder || 0,
        projectId: dto.projectId ? BigInt(dto.projectId) : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      const saved = await this.repository.save(certificate);
      return CertificateResponseDto.fromDomain(saved);
    }
    
    async update(id: bigint, dto: UpdateCertificateDto): Promise<CertificateResponseDto> {
      const certificate = await this.repository.findById(id);
      if (!certificate) {
        throw new EntityNotFoundException('Certificate', id.toString());
      }
      
      // Use domain methods
      if (dto.name || dto.description) {
        certificate.updateDetails(dto.name || certificate.name, dto.description);
      }
      
      if (dto.status) {
        const newStatus = Status.fromString(dto.status);
        if (newStatus.isActive()) {
          certificate.activate();
        } else {
          certificate.deactivate();
        }
      }
      
      const updated = await this.repository.update(certificate);
      return CertificateResponseDto.fromDomain(updated);
    }
    
    async delete(id: bigint): Promise<void> {
      const certificate = await this.repository.findById(id);
      if (!certificate) {
        throw new EntityNotFoundException('Certificate', id.toString());
      }
      
      certificate.softDelete();
      await this.repository.update(certificate);
    }
  }
  ```

#### **Ngày 4-5: Update Certificate Module & Controller**
- [ ] Update `src/modules/introduction/certificate/certificate.module.ts`
  ```typescript
  import { Module } from '@nestjs/common';
  import { CertificateRepositoryModule } from '@/infrastructure/persistence/prisma/repositories/certificate-repository.module';
  import { AdminCertificateService } from './admin/services/certificate.service';
  import { AdminCertificateController } from './admin/controllers/certificate.controller';
  // ... other imports
  
  @Module({
    imports: [
      CertificateRepositoryModule, // ← Import repository module
    ],
    controllers: [AdminCertificateController, PublicCertificateController],
    providers: [AdminCertificateService, PublicCertificateService],
  })
  export class CertificateModule {}
  ```

- [ ] Update Controller để sử dụng DTOs mới
- [ ] Test toàn bộ CRUD operations

---

### **GIAI ĐOẠN 4: Áp Dụng Cho Các Module Còn Lại (Tuần 6-8)**

#### **Chiến lược**: Chia modules thành 3 nhóm ưu tiên

##### **Tuần 6: Nhóm 1 - Core Modules (Ưu tiên cao)**
- [ ] **Post** (có comment, view stats - phức tạp nhất)
  - Domain Model với business logic
  - Repository với pagination phức tạp
  - Mapper xử lý relations (category, tags, comments)
  
- [ ] **User** (authentication, authorization)
  - Domain Model với password hashing
  - Repository với role/permission queries
  
- [ ] **Menu** (hierarchical structure)
  - Domain Model với tree structure
  - Repository với recursive queries

##### **Tuần 7: Nhóm 2 - Introduction Modules**
- [ ] About
- [ ] Contact
- [ ] FAQ
- [ ] Gallery
- [ ] Partner
- [ ] Project
- [ ] Staff
- [ ] Testimonial

**Quy trình cho mỗi module**:
1. Tạo Domain Model (1-2 giờ)
2. Tạo Repository Interface (30 phút)
3. Tạo DTOs (1 giờ)
4. Tạo Mapper (1 giờ)
5. Tạo Prisma Repository (2 giờ)
6. Refactor Service (2-3 giờ)
7. Update Module & Test (1 giờ)

**Tổng**: ~8-10 giờ/module → 2 modules/ngày

##### **Tuần 8: Nhóm 3 - Marketing & System Modules**
- [ ] Banner
- [ ] BannerLocation
- [ ] System Config (Email, General)
- [ ] Context & Group
- [ ] Permission & Role
- [ ] Notification

---

### **GIAI ĐOẠN 5: Cleanup & Optimization (Tuần 9)**

#### **Ngày 1-2: Xóa Code Cũ**
- [ ] Xóa `src/common/base/services/prisma/prisma-crud.service.ts`
- [ ] Xóa `src/common/base/services/prisma/prisma-list.service.ts`
- [ ] Xóa các repository cũ trong `src/modules/*/repositories/*.prisma.repository.ts`
- [ ] Update imports trong toàn bộ codebase

#### **Ngày 3: Performance Optimization**
- [ ] Thêm caching cho repositories (Redis)
  ```typescript
  @Injectable()
  export class CachedCertificateRepository implements ICertificateRepository {
    constructor(
      private readonly baseRepo: CertificatePrismaRepository,
      private readonly cache: RedisService,
    ) {}
    
    async findById(id: bigint): Promise<Certificate | null> {
      const cacheKey = `certificate:${id}`;
      const cached = await this.cache.get(cacheKey);
      if (cached) return JSON.parse(cached);
      
      const entity = await this.baseRepo.findById(id);
      if (entity) {
        await this.cache.set(cacheKey, JSON.stringify(entity), 3600);
      }
      return entity;
    }
  }
  ```

- [ ] Thêm database indexes cho các queries thường dùng
- [ ] Optimize N+1 queries với DataLoader (nếu cần)

#### **Ngày 4: Testing**
- [ ] Viết unit tests cho Domain Models
  ```typescript
  describe('Certificate Domain Model', () => {
    it('should create valid certificate', () => {
      const cert = Certificate.create(1n, {
        name: 'Test Certificate',
        status: Status.active(),
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      expect(cert.isActive()).toBe(true);
    });
    
    it('should throw error for invalid name', () => {
      expect(() => {
        Certificate.create(1n, {
          name: '',
          status: Status.active(),
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }).toThrow(ValidationException);
    });
  });
  ```

- [ ] Viết unit tests cho Services (mock repositories)
- [ ] Viết integration tests cho Repositories

#### **Ngày 5: Documentation**
- [ ] Tạo `docs/ARCHITECTURE.md` - Giải thích kiến trúc mới
- [ ] Tạo `docs/CODING_GUIDELINES.md` - Hướng dẫn code cho team
- [ ] Tạo `docs/MIGRATION_GUIDE.md` - Hướng dẫn migrate modules mới
- [ ] Update README.md

---

## 📝 Templates & Code Generators

### **Template 1: Domain Model Generator**
```bash
# Script: scripts/generate-domain-model.sh
# Usage: npm run generate:domain -- --name Certificate --module introduction

#!/bin/bash
NAME=$1
MODULE=$2

cat > "src/domain/models/${NAME,,}.model.ts" << EOF
import { AggregateRoot } from '@/common/base/domain/aggregate-root.base';
import { Status } from '@/domain/value-objects/status.vo';

export interface I${NAME}Props {
  name: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export class ${NAME} extends AggregateRoot<bigint> {
  private props: I${NAME}Props;
  
  private constructor(id: bigint, props: I${NAME}Props) {
    super(id);
    this.props = props;
  }
  
  static create(id: bigint, props: I${NAME}Props): ${NAME} {
    // Add validation
    return new ${NAME}(id, props);
  }
  
  // Getters
  get name(): string {
    return this.props.name;
  }
  
  get status(): Status {
    return this.props.status;
  }
  
  // Business methods
  isActive(): boolean {
    return this.props.status.isActive() && !this.props.deletedAt;
  }
}
EOF

echo "✅ Created domain model: src/domain/models/${NAME,,}.model.ts"
```

### **Template 2: Repository Interface Generator**
```bash
# Script: scripts/generate-repository-interface.sh
# Usage: npm run generate:repo-interface -- --name Certificate

#!/bin/bash
NAME=$1

cat > "src/domain/repositories/${NAME,,}.repository.interface.ts" << EOF
import { IBaseRepository } from '@/common/base/repository/base.repository.interface';
import { ${NAME} } from '@/domain/models/${NAME,,}.model';

export interface I${NAME}Repository extends IBaseRepository<${NAME}, bigint> {
  findActive(): Promise<${NAME}[]>;
  findByStatus(status: string): Promise<${NAME}[]>;
  
  findWithPagination(options: {
    page: number;
    limit: number;
    status?: string;
    search?: string;
  }): Promise<{
    items: ${NAME}[];
    total: number;
    page: number;
    limit: number;
  }>;
}
EOF

echo "✅ Created repository interface: src/domain/repositories/${NAME,,}.repository.interface.ts"
```

### **Template 3: Mapper Generator**
```bash
# Script: scripts/generate-mapper.sh
# Usage: npm run generate:mapper -- --name Certificate --table certificate

#!/bin/bash
NAME=$1
TABLE=$2

cat > "src/infrastructure/persistence/prisma/mappers/${NAME,,}.mapper.ts" << EOF
import { Injectable } from '@nestjs/common';
import { ${NAME} as Prisma${NAME} } from '@prisma/client';
import { ${NAME} } from '@/domain/models/${NAME,,}.model';
import { Status } from '@/domain/value-objects/status.vo';
import { IMapper } from '../mapper.interface';

@Injectable()
export class ${NAME}Mapper implements IMapper<${NAME}, Prisma${NAME}> {
  toDomain(raw: Prisma${NAME}): ${NAME} {
    return ${NAME}.create(raw.id, {
      name: raw.name,
      status: Status.fromString(raw.status),
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
      deletedAt: raw.deleted_at,
    });
  }
  
  toPersistence(domain: ${NAME}): any {
    return {
      id: domain.id,
      name: domain.name,
      status: domain.status.value,
      created_at: domain.createdAt,
      updated_at: domain.updatedAt,
      deleted_at: domain.deletedAt,
    };
  }
}
EOF

echo "✅ Created mapper: src/infrastructure/persistence/prisma/mappers/${NAME,,}.mapper.ts"
```

---

## 🎯 Checklist Tổng Thể

### **Foundation (Tuần 1-2)**
- [ ] Base Domain Classes (Entity, ValueObject, AggregateRoot)
- [ ] Base Repository Interface
- [ ] Domain Exceptions
- [ ] Common Value Objects (Email, Status, DateRange)
- [ ] Mapper Interface & Utilities

### **Pilot Module - Certificate (Tuần 3-5)**
- [ ] Certificate Domain Model
- [ ] Certificate Repository Interface
- [ ] Certificate DTOs
- [ ] Certificate Mapper
- [ ] Certificate Prisma Repository
- [ ] Refactor Certificate Service
- [ ] Update Certificate Module
- [ ] Test Certificate CRUD

### **Core Modules (Tuần 6)**
- [ ] Post Module (với comments, stats)
- [ ] User Module (với auth)
- [ ] Menu Module (với tree structure)

### **Introduction Modules (Tuần 7)**
- [ ] About, Contact, FAQ, Gallery
- [ ] Partner, Project, Staff, Testimonial

### **Marketing & System Modules (Tuần 8)**
- [ ] Banner, BannerLocation
- [ ] System Config, Context, Permission, Role
- [ ] Notification

### **Cleanup & Optimization (Tuần 9)**
- [ ] Xóa code cũ (PrismaCrudService, PrismaListService)
- [ ] Performance optimization (caching, indexes)
- [ ] Unit tests cho Domain Models
- [ ] Integration tests cho Repositories
- [ ] Documentation (Architecture, Guidelines, Migration)

---

## 📊 Metrics & Success Criteria

### **Code Quality Metrics**
- [ ] 0% Services import Prisma types
- [ ] 100% Domain Models có unit tests
- [ ] 100% Repositories có integration tests
- [ ] Code coverage > 80%

### **Performance Metrics**
- [ ] API response time không tăng > 10% so với hiện tại
- [ ] Database queries không tăng (tránh N+1)
- [ ] Memory usage không tăng > 15%

### **Maintainability Metrics**
- [ ] Có thể thêm TypeORM implementation trong < 1 tuần
- [ ] Có thể thêm module mới trong < 4 giờ (sử dụng templates)
- [ ] Team members hiểu rõ kiến trúc (qua documentation)

---

## 🚨 Rủi Ro & Giải Pháp

### **Rủi Ro 1: Breaking Changes**
**Giải pháp**:
- Tạo branch riêng cho refactoring
- Merge từng module một (không merge toàn bộ cùng lúc)
- Giữ API contracts không đổi (Controllers trả về cùng format)

### **Rủi Ro 2: Performance Regression**
**Giải pháp**:
- Benchmark trước khi refactor
- Monitor performance sau mỗi module
- Rollback nếu performance giảm > 15%

### **Rủi Ro 3: Team Adoption**
**Giải pháp**:
- Training session sau khi hoàn thành pilot module
- Pair programming cho 2-3 modules đầu tiên
- Code review nghiêm ngặt

---

## 🎓 Training Plan

### **Session 1: Domain-Driven Design Basics (2 giờ)**
- Giới thiệu DDD concepts
- Entity vs Value Object
- Aggregate Root
- Repository Pattern

### **Session 2: Hands-on với Certificate Module (3 giờ)**
- Walk through Certificate implementation
- Live coding: Tạo 1 module mới (FAQ)
- Q&A

### **Session 3: Best Practices & Patterns (2 giờ)**
- Mapper pattern
- DTO pattern
- Exception handling
- Testing strategies

---

## 📚 Tài Liệu Tham Khảo

1. **Domain-Driven Design** - Eric Evans
2. **Clean Architecture** - Robert C. Martin
3. **Implementing Domain-Driven Design** - Vaughn Vernon
4. **NestJS Documentation** - https://docs.nestjs.com
5. **Prisma Best Practices** - https://www.prisma.io/docs/guides

---

## ✅ Kết Luận

Sau khi hoàn thành kế hoạch này, bạn sẽ có:

1. ✅ **Kiến trúc hoàn toàn độc lập với Prisma**
   - Có thể đổi sang TypeORM/Sequelize trong 1-2 tuần
   - Có thể thêm database thứ 2 (MongoDB, DynamoDB) dễ dàng

2. ✅ **Code dễ test hơn 10 lần**
   - Unit test Domain Models (không cần database)
   - Mock repositories dễ dàng
   - Integration test riêng biệt

3. ✅ **Business Logic rõ ràng**
   - Domain Models chứa business rules
   - Services chỉ orchestrate
   - Controllers chỉ handle HTTP

4. ✅ **Dễ mở rộng**
   - Thêm module mới < 4 giờ (với templates)
   - Thêm feature mới không ảnh hưởng code cũ
   - Team mới onboard nhanh hơn

---

**Bắt đầu từ đâu?**
→ Tuần 1, Ngày 1: Tạo Base Domain Classes! 🚀
