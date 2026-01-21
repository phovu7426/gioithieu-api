# Kế hoạch Refactor Service: Loại bỏ sự phụ thuộc vào Prisma

Tài liệu này hướng dẫn chi tiết các bước để refactor một Service đang phụ thuộc trực tiếp vào `PrismaService` sang sử dụng **Repository Pattern**. Mục tiêu là tách biệt Service khỏi tầng Database, cho phép thay thế DB (ví dụ: chuyển từ MySQL sang MongoDB, Postgres) mà không cần sửa đổi logic của Service.

## 1. Mục tiêu
- **Độc lập**: Service không phụ thuộc vào `Prisma`. Chỉ làm việc với Interface.
- **Linh hoạt**: Thay đổi DB chỉ cần thay đổi Repository.
- **Giữ nguyên logic**: Logic nghiệp vụ trong Service được giữ nguyên, chỉ thay đổi cách truy xuất dữ liệu.

## 2. Quy trình thực hiện (Step-by-Step)

Giả sử chúng ta đang refactor một module tên là `Feature` (ví dụ: `Contact`, `Product`, `User`...).

### Bước 1: Định nghĩa Domain Model (Nếu chưa có)
Tạo model đại diện cho Business Entity, **không phụ thuộc vào Prisma**.
File: `src/domain/models/feature.model.ts`

```typescript
export class FeatureModel {
  id: number;
  name: string;
  // ... các field khác
  created_at: Date;
  updated_at: Date;

  // Có thể thêm business logic method tại đây
}
```

### Bước 2: Định nghĩa Repository Interface
Đây là hợp đồng (contract) mà Service sẽ sử dụng.
File: `src/modules/feature/repositories/feature.repository.interface.ts`

```typescript
import { FeatureModel } from '@/domain/models/feature.model';

export const FEATURE_REPOSITORY = 'FEATURE_REPOSITORY';

export interface IFeatureRepository {
  create(data: any): Promise<FeatureModel>;
  findAll(filter: any): Promise<{ data: FeatureModel[]; total: number }>;
  findById(id: number): Promise<FeatureModel | null>;
  update(id: number, data: any): Promise<FeatureModel>;
  delete(id: number): Promise<boolean>;
  // Các method đặc thù khác...
}
```

### Bước 3: Implement Repository với Prisma
Class này sẽ thực hiện các thao tác DB thực tế sử dụng Prisma. Nếu đổi DB, ta chỉ cần tạo một class mới implement `IFeatureRepository`.
File: `src/modules/feature/repositories/feature.prisma.repository.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/services/prisma.service'; // Hoặc đường dẫn tới PrismaService
import { IFeatureRepository } from './feature.repository.interface';
import { FeatureModel } from '@/domain/models/feature.model';

@Injectable()
export class FeaturePrismaRepository implements IFeatureRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any): Promise<FeatureModel> {
    return this.prisma.feature.create({ data });
  }

  async findAll(filter: any): Promise<{ data: FeatureModel[]; total: number }> {
    // Implement logic filter Prisma
    const where = {}; // xây dựng where từ filter
    const [data, total] = await Promise.all([
      this.prisma.feature.findMany({ where }),
      this.prisma.feature.count({ where }),
    ]);
    return { data, total };
  }

  async findById(id: number): Promise<FeatureModel | null> {
    return this.prisma.feature.findUnique({ where: { id } });
  }

  async update(id: number, data: any): Promise<FeatureModel> {
    return this.prisma.feature.update({ where: { id }, data });
  }

  async delete(id: number): Promise<boolean> {
    await this.prisma.feature.delete({ where: { id } });
    return true;
  }
}
```

### Bước 4: Tạo Repository Module
Module này chịu trách nhiệm cung cấp (Provide) implementation cho Interface.
File: `src/modules/feature/feature.repository.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/modules/prisma/prisma.module'; // Import PrismaModule gốc
import { FeaturePrismaRepository } from './repositories/feature.prisma.repository';
import { FEATURE_REPOSITORY } from './repositories/feature.repository.interface';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: FEATURE_REPOSITORY,
      useClass: FeaturePrismaRepository, // Bind Interface với Implementation này
    },
  ],
  exports: [FEATURE_REPOSITORY],
})
export class FeatureRepositoryModule {}
```

### Bước 5: Cập nhật Service Module
Import `RepositoryModule` vào module chính của feature.
File: `src/modules/feature/feature.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { FeatureRepositoryModule } from './feature.repository.module';
import { FeatureService } from './services/feature.service';
// ...

@Module({
  imports: [
    FeatureRepositoryModule, 
    // ... bỏ PrismaModule nếu không dùng trực tiếp ở đâu khác
  ],
  providers: [FeatureService],
  // ...
})
export class FeatureModule {}
```

### Bước 6: Refactor Service (LOẠI BỎ PRISMA)
Đây là bước quan trọng nhất. Thay thế `PrismaService` bằng `IFeatureRepository`.
File: `src/modules/feature/services/feature.service.ts`

```typescript
import { Inject, Injectable } from '@nestjs/common';
import { IFeatureRepository, FEATURE_REPOSITORY } from '../repositories/feature.repository.interface';

@Injectable()
export class FeatureService {
  constructor(
    @Inject(FEATURE_REPOSITORY)
    private readonly featureRepo: IFeatureRepository,
  ) {}

  async create(data: any) {
    // Logic validate...
    return this.featureRepo.create(data);
  }

  async getList(query: any) {
    return this.featureRepo.findAll(query);
  }

  // ... Các method khác dùng this.featureRepo thay vì this.prisma.feature
}
```

## 3. Tổng kết kiến trúc
Sau khi refactor:
1.  **Service**: Chỉ biết gọi `IFeatureRepository`. Không có `import { PrismaService }`.
2.  **Repo Interface**: Định nghĩa Input/Output chuẩn.
3.  **Prisma Repo**: Ôm trọn logic Prisma (Where, Select, Include...).
4.  **Module**: Dùng `RepositoryModule` để gắn kết Interface và Implementation.


Khi muốn đổi sang Database khác (ví dụ TypeORM), bạn chỉ cần viết `FeatureTypeOrmRepository` implement `IFeatureRepository`, và đổi `useClass` trong `FeatureRepositoryModule`. Service service không cần sửa một dòng code nào.

## 4. Luồng dữ liệu (Data Flow)

Để dễ hình dung, đây là luồng đi của dữ liệu trong kiến trúc này:

REQUEST 
  👇
**Controller** (Nhận request, validate dữ liệu đầu vào)
  👇
**Service** (Xử lý nghiệp vụ chính, tính toán, kiểm tra rule)
  👇
**Repository Interface** (Hợp đồng giao tiếp - Service chỉ biết ông này)
  👇
**Repository Implementation** (Code thực thi: Prisma, TypeORM, Raw SQL...)
  👇
**Database** (MySQL, Postgres, MongoDB...)

