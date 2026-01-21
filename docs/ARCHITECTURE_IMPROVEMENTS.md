# Cải Tiến Kiến Trúc - Từ Good → Excellent

## 📊 Đánh Giá Tổng Thể

| Tiêu chí | Đánh giá | Ghi chú |
|----------|----------|---------|
| Clean Architecture | ✅ Chuẩn | Domain layer hoàn toàn sạch |
| Tách Domain khỏi ORM | ✅ Rất tốt | Mapper pattern đúng DDD |
| Thay được Prisma/ORM | ✅ | Có thể swap trong 1-2 tuần |
| Dễ test (unit/domain) | ✅ | Domain không phụ thuộc framework |
| Phù hợp NestJS DI | ✅ | Inject repositories qua interface |
| Không over-engineering | ⚠️ | Gần ngưỡng, nhưng vẫn ổn |

**Kết luận**: ✅ **OK cho production**, team 5-15 người, project dài hạn

---

## 🎯 3 Cải Tiến "Ít Nhưng Chất"

### **Cải Tiến 1: Use Case Pattern (thay vì God Service)**

#### ❌ Hiện tại (Service quá lớn)
```typescript
// application/services/certificate.service.ts
@Injectable()
export class CertificateService {
  constructor(
    @Inject('ICertificateRepository')
    private readonly repo: ICertificateRepository,
    @Inject('IProjectRepository')
    private readonly projectRepo: IProjectRepository,
    private readonly eventBus: EventBus,
    private readonly logger: Logger,
  ) {}
  
  async create(dto: CreateCertificateDto) { /* 50 lines */ }
  async update(id: bigint, dto: UpdateCertificateDto) { /* 60 lines */ }
  async delete(id: bigint) { /* 30 lines */ }
  async getList(options: any) { /* 40 lines */ }
  async getById(id: bigint) { /* 20 lines */ }
  async activate(id: bigint) { /* 25 lines */ }
  async deactivate(id: bigint) { /* 25 lines */ }
  // ... 10+ methods → God Service 🔥
}
```

**Vấn đề**:
- File quá dài (500+ lines)
- Khó test từng business case
- Khó maintain khi team lớn
- Nhiều người sửa cùng file → conflict

#### ✅ Cải tiến: 1 Use Case = 1 Business Intent

```
application/
└── use-cases/
    └── certificate/
        ├── commands/                    # CQS Pattern
        │   ├── create-certificate/
        │   │   ├── create-certificate.usecase.ts
        │   │   ├── create-certificate.dto.ts
        │   │   └── create-certificate.spec.ts
        │   ├── update-certificate/
        │   │   ├── update-certificate.usecase.ts
        │   │   ├── update-certificate.dto.ts
        │   │   └── update-certificate.spec.ts
        │   ├── delete-certificate/
        │   │   └── delete-certificate.usecase.ts
        │   ├── activate-certificate/
        │   │   └── activate-certificate.usecase.ts
        │   └── deactivate-certificate/
        │       └── deactivate-certificate.usecase.ts
        │
        └── queries/
            ├── get-certificate/
            │   ├── get-certificate.usecase.ts
            │   └── certificate.response.dto.ts
            └── list-certificates/
                ├── list-certificates.usecase.ts
                ├── list-certificates.query.ts
                └── certificate-list.response.dto.ts
```

#### 📝 Code mẫu

**1. Create Certificate Use Case**
```typescript
// application/use-cases/certificate/commands/create-certificate/create-certificate.usecase.ts
import { Injectable, Inject } from '@nestjs/common';
import { ICertificateRepository } from '@/domain/repositories/certificate.repository.interface';
import { IProjectRepository } from '@/domain/repositories/project.repository.interface';
import { Certificate } from '@/domain/models/certificate.model';
import { Status } from '@/domain/value-objects/status.vo';
import { CreateCertificateDto } from './create-certificate.dto';
import { CertificateResponseDto } from '../../queries/get-certificate/certificate.response.dto';
import { EntityNotFoundException } from '@/domain/exceptions/entity-not-found.exception';

@Injectable()
export class CreateCertificateUseCase {
  constructor(
    @Inject('ICertificateRepository')
    private readonly certificateRepo: ICertificateRepository,
    @Inject('IProjectRepository')
    private readonly projectRepo: IProjectRepository,
  ) {}

  async execute(dto: CreateCertificateDto): Promise<CertificateResponseDto> {
    // 1. Validate project exists (if provided)
    if (dto.projectId) {
      const projectExists = await this.projectRepo.exists(BigInt(dto.projectId));
      if (!projectExists) {
        throw new EntityNotFoundException('Project', dto.projectId);
      }
    }

    // 2. Create domain entity
    const certificate = Certificate.create(0n, {
      name: dto.name,
      description: dto.description,
      imageUrl: dto.imageUrl,
      status: Status.fromString(dto.status || 'active'),
      sortOrder: dto.sortOrder || 0,
      projectId: dto.projectId ? BigInt(dto.projectId) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 3. Save to repository
    const saved = await this.certificateRepo.save(certificate);

    // 4. Return DTO
    return CertificateResponseDto.fromDomain(saved);
  }
}
```

**2. Update Certificate Use Case**
```typescript
// application/use-cases/certificate/commands/update-certificate/update-certificate.usecase.ts
@Injectable()
export class UpdateCertificateUseCase {
  constructor(
    @Inject('ICertificateRepository')
    private readonly certificateRepo: ICertificateRepository,
  ) {}

  async execute(id: bigint, dto: UpdateCertificateDto): Promise<CertificateResponseDto> {
    // 1. Find existing
    const certificate = await this.certificateRepo.findById(id);
    if (!certificate) {
      throw new EntityNotFoundException('Certificate', id.toString());
    }

    // 2. Apply changes using domain methods
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

    // 3. Save
    const updated = await this.certificateRepo.update(certificate);

    // 4. Return DTO
    return CertificateResponseDto.fromDomain(updated);
  }
}
```

**3. Controller sử dụng Use Cases**
```typescript
// modules/introduction/certificate/admin/controllers/certificate.controller.ts
@Controller('admin/certificates')
export class AdminCertificateController {
  constructor(
    private readonly createUseCase: CreateCertificateUseCase,
    private readonly updateUseCase: UpdateCertificateUseCase,
    private readonly deleteUseCase: DeleteCertificateUseCase,
    private readonly getUseCase: GetCertificateUseCase,
    private readonly listUseCase: ListCertificatesUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateCertificateDto) {
    return this.createUseCase.execute(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCertificateDto) {
    return this.updateUseCase.execute(BigInt(id), dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.deleteUseCase.execute(BigInt(id));
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getUseCase.execute(BigInt(id));
  }

  @Get()
  async getList(@Query() query: ListCertificatesQuery) {
    return this.listUseCase.execute(query);
  }
}
```

**Lợi ích**:
- ✅ Mỗi file < 100 lines → dễ đọc
- ✅ Test riêng từng use case
- ✅ Team chia nhau làm không conflict
- ✅ Dễ thêm logging, validation, caching cho từng use case
- ✅ Rõ ràng business intent

---

### **Cải Tiến 2: DTO theo Context (Admin / Public / Internal)**

#### ❌ Hiện tại (DTO chung loạn)
```
application/dtos/
└── certificate/
    ├── create-certificate.dto.ts      # Admin dùng
    ├── update-certificate.dto.ts      # Admin dùng
    └── certificate-response.dto.ts    # Admin + Public đều dùng → conflict
```

**Vấn đề**:
- Admin cần nhiều field hơn Public
- Public không được thấy `deleted_at`, `internal_notes`
- Sau này có Internal API → thêm loạn

#### ✅ Cải tiến: Tách theo Context

```
application/
└── use-cases/
    └── certificate/
        ├── commands/
        │   └── create-certificate/
        │       └── create-certificate.dto.ts    # Admin only
        │
        └── queries/
            ├── admin/
            │   ├── get-certificate/
            │   │   └── admin-certificate.response.dto.ts
            │   └── list-certificates/
            │       └── admin-certificate-list.response.dto.ts
            │
            ├── public/
            │   ├── get-certificate/
            │   │   └── public-certificate.response.dto.ts
            │   └── list-certificates/
            │       └── public-certificate-list.response.dto.ts
            │
            └── internal/                        # Future: sync APIs
                └── sync-certificate.dto.ts
```

#### 📝 Code mẫu

**Admin Response DTO (đầy đủ thông tin)**
```typescript
// application/use-cases/certificate/queries/admin/get-certificate/admin-certificate.response.dto.ts
export class AdminCertificateResponseDto {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  status: string;
  sortOrder: number;
  projectId?: string;
  project?: {                    // ← Admin thấy relation
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;            // ← Admin thấy soft-delete
  internalNotes?: string;        // ← Admin-only field

  static fromDomain(certificate: Certificate, includeProject = false): AdminCertificateResponseDto {
    return {
      id: certificate.id.toString(),
      name: certificate.name,
      description: certificate.description,
      imageUrl: certificate.imageUrl,
      status: certificate.status.value,
      sortOrder: certificate.sortOrder,
      projectId: certificate.projectId?.toString(),
      project: includeProject ? certificate.project : undefined,
      createdAt: certificate.createdAt.toISOString(),
      updatedAt: certificate.updatedAt.toISOString(),
      deletedAt: certificate.deletedAt?.toISOString(),
      internalNotes: certificate.internalNotes,
    };
  }
}
```

**Public Response DTO (ẩn thông tin nhạy cảm)**
```typescript
// application/use-cases/certificate/queries/public/get-certificate/public-certificate.response.dto.ts
export class PublicCertificateResponseDto {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  // ❌ Không có status, sortOrder, deletedAt, internalNotes

  static fromDomain(certificate: Certificate): PublicCertificateResponseDto {
    return {
      id: certificate.id.toString(),
      name: certificate.name,
      description: certificate.description,
      imageUrl: certificate.imageUrl,
    };
  }
}
```

**Lợi ích**:
- ✅ Admin/Public không dùng chung DTO → tránh lộ data
- ✅ Dễ thêm context mới (Internal, Partner API)
- ✅ Type-safe: compiler bắt lỗi nếu trả sai DTO

---

### **Cải Tiến 3: Domain Events (Nâng cấp DDD)**

#### 🎯 Khi nào cần?
- Khi có **side effects** phức tạp: gửi email, sync cache, log audit
- Khi muốn **decouple** logic: tạo certificate → gửi notification (không viết trong use case)
- Khi cần **async processing**: tạo post → tính view stats (không block API)

#### 📁 Cấu trúc

```
domain/
└── events/
    ├── base/
    │   └── domain-event.base.ts
    ├── certificate/
    │   ├── certificate-created.event.ts
    │   ├── certificate-updated.event.ts
    │   └── certificate-deleted.event.ts
    └── post/
        ├── post-created.event.ts
        └── post-viewed.event.ts

infrastructure/
└── event-handlers/
    ├── certificate/
    │   ├── send-certificate-notification.handler.ts
    │   └── sync-certificate-cache.handler.ts
    └── post/
        └── increment-view-count.handler.ts
```

#### 📝 Code mẫu

**1. Base Domain Event**
```typescript
// domain/events/base/domain-event.base.ts
export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventId: string;

  constructor() {
    this.occurredOn = new Date();
    this.eventId = crypto.randomUUID();
  }

  abstract getEventName(): string;
}
```

**2. Certificate Created Event**
```typescript
// domain/events/certificate/certificate-created.event.ts
export class CertificateCreatedEvent extends DomainEvent {
  constructor(
    public readonly certificateId: bigint,
    public readonly certificateName: string,
    public readonly projectId?: bigint,
  ) {
    super();
  }

  getEventName(): string {
    return 'certificate.created';
  }
}
```

**3. Domain Model dispatch event**
```typescript
// domain/models/certificate.model.ts
export class Certificate extends AggregateRoot<bigint> {
  private domainEvents: DomainEvent[] = [];

  static create(id: bigint, props: ICertificateProps): Certificate {
    const certificate = new Certificate(id, props);
    
    // Dispatch event
    certificate.addDomainEvent(
      new CertificateCreatedEvent(id, props.name, props.projectId)
    );
    
    return certificate;
  }

  private addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  public getDomainEvents(): DomainEvent[] {
    return this.domainEvents;
  }

  public clearDomainEvents(): void {
    this.domainEvents = [];
  }
}
```

**4. Use Case dispatch events**
```typescript
// application/use-cases/certificate/commands/create-certificate/create-certificate.usecase.ts
@Injectable()
export class CreateCertificateUseCase {
  constructor(
    @Inject('ICertificateRepository')
    private readonly certificateRepo: ICertificateRepository,
    private readonly eventBus: EventBus,  // ← NestJS EventEmitter
  ) {}

  async execute(dto: CreateCertificateDto): Promise<CertificateResponseDto> {
    // 1. Create domain entity
    const certificate = Certificate.create(0n, { /* ... */ });

    // 2. Save to repository
    const saved = await this.certificateRepo.save(certificate);

    // 3. Dispatch domain events
    const events = saved.getDomainEvents();
    for (const event of events) {
      await this.eventBus.emit(event.getEventName(), event);
    }
    saved.clearDomainEvents();

    // 4. Return DTO
    return CertificateResponseDto.fromDomain(saved);
  }
}
```

**5. Event Handler (Infrastructure)**
```typescript
// infrastructure/event-handlers/certificate/send-certificate-notification.handler.ts
@Injectable()
export class SendCertificateNotificationHandler {
  constructor(
    private readonly mailer: MailerService,
    private readonly logger: Logger,
  ) {}

  @OnEvent('certificate.created')
  async handle(event: CertificateCreatedEvent): Promise<void> {
    this.logger.log(`Sending notification for certificate ${event.certificateId}`);
    
    // Send email to admin
    await this.mailer.send({
      to: 'admin@example.com',
      subject: 'New Certificate Created',
      template: 'certificate-created',
      context: {
        certificateName: event.certificateName,
      },
    });
  }
}
```

**Lợi ích**:
- ✅ Use Case không biết về email, cache, logging
- ✅ Dễ thêm side effects mới (không sửa use case)
- ✅ Dễ test: mock EventBus
- ✅ Async processing: dùng Queue thay EventEmitter

---

## 🧠 Quy Ước Naming (Best Practices)

| Thứ | Quy ước | Ví dụ |
|-----|---------|-------|
| **Domain Model** | `{Entity}` | `Certificate`, `Post`, `User` |
| **Repository Interface** | `I{Entity}Repository` | `ICertificateRepository` |
| **Prisma Repository** | `{Entity}PrismaRepository` | `CertificatePrismaRepository` |
| **Use Case (Command)** | `{Verb}{Entity}UseCase` | `CreateCertificateUseCase` |
| **Use Case (Query)** | `Get{Entity}UseCase` / `List{Entity}sUseCase` | `GetCertificateUseCase` |
| **Mapper** | `{Entity}Mapper` | `CertificateMapper` |
| **Domain Event** | `{Entity}{Action}Event` | `CertificateCreatedEvent` |
| **Value Object** | `{Name}` | `Email`, `Status`, `Money` |
| **Exception** | `{Name}Exception` | `EntityNotFoundException` |

---

## 🧪 Testing Strategy (Cực Dễ)

### **1. Domain Model Tests (Pure Unit)**
```typescript
// domain/models/certificate.model.spec.ts
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
    expect(cert.name).toBe('Test Certificate');
  });

  it('should throw error for empty name', () => {
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

  it('should activate certificate', () => {
    const cert = Certificate.create(1n, { /* ... */ });
    cert.activate();
    expect(cert.status.value).toBe('active');
  });
});
```

### **2. Use Case Tests (Mock Repository)**
```typescript
// application/use-cases/certificate/commands/create-certificate/create-certificate.usecase.spec.ts
describe('CreateCertificateUseCase', () => {
  let useCase: CreateCertificateUseCase;
  let mockRepo: jest.Mocked<ICertificateRepository>;
  let mockProjectRepo: jest.Mocked<IProjectRepository>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
    } as any;
    
    mockProjectRepo = {
      exists: jest.fn(),
    } as any;

    useCase = new CreateCertificateUseCase(mockRepo, mockProjectRepo);
  });

  it('should create certificate successfully', async () => {
    // Arrange
    const dto: CreateCertificateDto = {
      name: 'Test Certificate',
      status: 'active',
      sortOrder: 1,
    };

    const savedCert = Certificate.create(1n, { /* ... */ });
    mockRepo.save.mockResolvedValue(savedCert);

    // Act
    const result = await useCase.execute(dto);

    // Assert
    expect(result.name).toBe('Test Certificate');
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
  });

  it('should throw error if project not found', async () => {
    // Arrange
    const dto: CreateCertificateDto = {
      name: 'Test',
      projectId: '999',
    };

    mockProjectRepo.exists.mockResolvedValue(false);

    // Act & Assert
    await expect(useCase.execute(dto)).rejects.toThrow(EntityNotFoundException);
  });
});
```

### **3. Repository Tests (Integration)**
```typescript
// infrastructure/persistence/prisma/repositories/certificate.prisma.repository.spec.ts
describe('CertificatePrismaRepository (Integration)', () => {
  let repo: CertificatePrismaRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    // Setup test database
    prisma = new PrismaService();
    const mapper = new CertificateMapper();
    repo = new CertificatePrismaRepository(prisma, mapper);
  });

  afterEach(async () => {
    await prisma.certificate.deleteMany();
  });

  it('should save and find certificate', async () => {
    // Arrange
    const cert = Certificate.create(0n, {
      name: 'Test',
      status: Status.active(),
      sortOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Act
    const saved = await repo.save(cert);
    const found = await repo.findById(saved.id);

    // Assert
    expect(found).not.toBeNull();
    expect(found!.name).toBe('Test');
  });
});
```

---

## 📂 Cấu Trúc Thư Mục Cuối Cùng (Optimized)

```
src/
├── domain/                                    # ← 100% Clean, không phụ thuộc gì
│   ├── models/
│   │   ├── certificate.model.ts
│   │   └── certificate.model.spec.ts         # ← Unit test
│   ├── repositories/
│   │   └── certificate.repository.interface.ts
│   ├── value-objects/
│   │   ├── email.vo.ts
│   │   ├── status.vo.ts
│   │   └── money.vo.ts
│   ├── events/
│   │   ├── base/
│   │   │   └── domain-event.base.ts
│   │   └── certificate/
│   │       ├── certificate-created.event.ts
│   │       └── certificate-updated.event.ts
│   └── exceptions/
│       ├── domain.exception.ts
│       ├── entity-not-found.exception.ts
│       └── validation.exception.ts
│
├── application/                               # ← Orchestration layer
│   └── use-cases/
│       └── certificate/
│           ├── commands/
│           │   ├── create-certificate/
│           │   │   ├── create-certificate.usecase.ts
│           │   │   ├── create-certificate.usecase.spec.ts
│           │   │   └── create-certificate.dto.ts
│           │   ├── update-certificate/
│           │   │   ├── update-certificate.usecase.ts
│           │   │   └── update-certificate.dto.ts
│           │   └── delete-certificate/
│           │       └── delete-certificate.usecase.ts
│           │
│           └── queries/
│               ├── admin/
│               │   ├── get-certificate/
│               │   │   ├── get-certificate.usecase.ts
│               │   │   └── admin-certificate.response.dto.ts
│               │   └── list-certificates/
│               │       ├── list-certificates.usecase.ts
│               │       ├── list-certificates.query.ts
│               │       └── admin-certificate-list.response.dto.ts
│               │
│               └── public/
│                   ├── get-certificate/
│                   │   └── public-certificate.response.dto.ts
│                   └── list-certificates/
│                       └── public-certificate-list.response.dto.ts
│
├── infrastructure/                            # ← Implementation details
│   ├── persistence/
│   │   └── prisma/
│   │       ├── repositories/
│   │       │   ├── certificate.prisma.repository.ts
│   │       │   ├── certificate.prisma.repository.spec.ts
│   │       │   └── certificate-repository.module.ts
│   │       └── mappers/
│   │           └── certificate.mapper.ts
│   │
│   └── event-handlers/
│       └── certificate/
│           ├── send-certificate-notification.handler.ts
│           └── sync-certificate-cache.handler.ts
│
└── modules/                                   # ← Presentation layer
    └── introduction/
        └── certificate/
            ├── admin/
            │   └── controllers/
            │       └── certificate.controller.ts
            ├── public/
            │   └── controllers/
            │       └── certificate.controller.ts
            └── certificate.module.ts
```

---

## ✅ Checklist Áp Dụng Cải Tiến

### **Cải tiến 1: Use Case Pattern**
- [ ] Tạo thư mục `application/use-cases/{module}/commands`
- [ ] Tạo thư mục `application/use-cases/{module}/queries`
- [ ] Tách mỗi method trong Service thành 1 Use Case
- [ ] Controller inject Use Cases thay vì Service
- [ ] Viết test cho từng Use Case

### **Cải tiến 2: DTO theo Context**
- [ ] Tạo `queries/admin/` và `queries/public/`
- [ ] Tách Response DTOs theo context
- [ ] Admin DTO có đầy đủ fields
- [ ] Public DTO chỉ có fields cần thiết
- [ ] Đảm bảo không dùng chung DTO giữa contexts

### **Cải tiến 3: Domain Events**
- [ ] Tạo `domain/events/base/domain-event.base.ts`
- [ ] Tạo events cho từng entity
- [ ] Domain Models dispatch events
- [ ] Use Cases emit events qua EventBus
- [ ] Tạo Event Handlers trong Infrastructure
- [ ] (Optional) Thay EventEmitter bằng Queue (Bull/BullMQ)

---

## 🎯 Kết Luận

### **Trước khi cải tiến**
```
✅ Clean Architecture
✅ Domain độc lập
⚠️ Service quá lớn
⚠️ DTO chung loạn
❌ Không có Events
```

### **Sau khi cải tiến**
```
✅ Clean Architecture
✅ Domain độc lập
✅ Use Case nhỏ gọn, rõ ràng
✅ DTO tách biệt theo context
✅ Domain Events cho side effects
✅ Dễ test 10x
✅ Dễ scale team
```

---

**Câu hỏi tiếp theo**: Bạn muốn tôi implement cải tiến nào trước?
1. Use Case Pattern cho Certificate module
2. Tách DTO Admin/Public
3. Domain Events infrastructure
