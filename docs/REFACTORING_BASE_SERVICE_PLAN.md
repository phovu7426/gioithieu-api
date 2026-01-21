# Kế hoạch Refactoring Base Service & Repository Pattern

## 1. Vấn đề hiện tại
Hiện tại, hệ thống đang bị phụ thuộc chặt chẽ vào Prisma thông qua các lớp Base:
- `PrismaListService` và `PrismaCrudService` yêu cầu trực tiếp `PrismaDelegate` (truyền model của Prisma Client).
- Các interface như `PrismaListOptions` sử dụng các type đặc thù của Prisma (`where`, `select`, `include`).
- Logic nghiệp vụ (như xử lý Slug, Status trong `BaseContentService`) đang được triển khai trực tiếp với Prisma logic.

**Hệ quả:** Khó khăn khi muốn chuyển đổi DB (ví dụ sang MongoDB, DynamoDB) hoặc khi Prisma có thay đổi lớn. Unit test cũng khó khăn hơn vì phải mock Prisma API phức tạp.

## 2. Mục tiêu Refactor
- **Giải phóng Service khỏi DB**: Service chỉ làm việc với Interface của Repository.
- **Generic hóa Base Service**: Tạo ra các lớp Base Service không mang tên "Prisma".
- **Chuẩn hóa Repository**: Mọi truy vấn DB phải đi qua Repository, ẩn đi logic cụ thể của ORM.
- **Domain-driven approach**: Sử dụng DTO/Entity thay vì sử dụng trực tiếp Model sinh ra từ Prisma ở tầng Service/Controller nếu có thể.

## 3. Kế hoạch chi tiết

### Giai đoạn 1: Củng cố Repository Layer (Đang thực hiện)
1.  **Hoàn thiện `IRepository<T>`**: Đảm bảo interface này bao quát đủ các case (CRUD, Pagination, Batch).
2.  **Chuẩn hóa `PrismaRepository`**: 
    - Chuyển toàn bộ logic `where`, `select`, `include` vào trong hàm `buildWhere` hoặc các hàm helper của Repository.
    - Không để Service truyền object `where` theo kiểu Prisma vào Repository.

### Giai đoạn 2: Xây dựng Generic Base Service (Mới)
1.  **Tạo `BaseService<T>`**:
    - Thay thế `PrismaCrudService`.
    - Inject `IRepository<T>` thay vì `PrismaDelegate`.
    - Giữ lại các Hooks (`beforeCreate`, `afterUpdate`, ...) để các service kế thừa có thể can thiệp logic.
2.  **Tạo `BaseContentService` (Generic)**:
    - Kế thừa từ `BaseService`.
    - Triển khai các tính năng content dùng chung: `ensureSlug`, `changeStatus`, `toggleFeatured`, `incrementViewCount` thông qua Repository interface.

### Giai đoạn 3: Chuyển đổi (Migration)
1.  **Refactor các Module hiện có**:
    - Chỉnh sửa `PostService`, `CategoryService`, vv. để kế thừa từ `BaseService` mới.
    - Xóa bỏ việc sử dụng `Prisma` types trong Service logic.
2.  **Dọn dẹp**:
    - Đổi tên hoặc loại bỏ các file `prisma-crud.service.ts`, `prisma-list.service.ts` sau khi đã chuyển đổi xong.

## 4. Cấu trúc đề xuất

### Thư mục `src/common/base`
- `interfaces/`: Chứa các interface chung (`IBaseRepository`, `IBaseService`, `IPagination`).
- `services/`: `base.service.ts`, `base-content.service.ts` (DB-agnostic).
- `repository/`:
  - `repository.interface.ts`
  - `prisma/`: Implementations cho Prisma (`prisma.repository.ts`, các repo con).

## 5. Ví dụ minh họa (Sau khi Refactor)

```typescript
// BaseService.ts
export abstract class BaseService<T, R extends IRepository<T>> {
  constructor(protected readonly repository: R) {}

  async getList(query: any) {
    return this.repository.findAll(query);
  }
  // ... other methods using this.repository
}

// PostService.ts
@Injectable()
export class PostService extends BaseService<Post, IPostRepository> {
  constructor(
    @Inject(POST_REPOSITORY) postRepo: IPostRepository
  ) {
    super(postRepo);
  }
}
```

---
*Kế hoạch này giúp tách biệt hoàn toàn Logic nghiệp vụ và Logic truy cập dữ liệu, giúp mã nguồn sạch hơn và dễ bảo trì.*
