import { NotFoundException } from '@nestjs/common';
import { IRepository, IPaginatedResult, IPaginationOptions } from '../repositories/repository.interface';
import { createPaginationMeta } from '../utils/pagination.helper';

/**
 * Base Service DB-agnostic.
 * Làm việc thông qua Repository Interface thay vì trực tiếp với ORM.
 */
export abstract class BaseService<T, R extends IRepository<T>> {
    constructor(protected readonly repository: R) { }

    /**
     * Hook: Xử lý dữ liệu trước khi tạo mới
     */
    protected async beforeCreate(data: any): Promise<any> {
        return data;
    }

    /**
     * Hook: Xử lý thực thể sau khi tạo mới
     */
    protected async afterCreate(entity: T, _data: any): Promise<void> { }

    /**
     * Hook: Xử lý dữ liệu trước khi cập nhật
     */
    protected async beforeUpdate(id: string | number | bigint, data: any): Promise<any> {
        return data;
    }

    /**
     * Hook: Xử lý thực thể sau khi cập nhật
     */
    protected async afterUpdate(entity: T, _data: any): Promise<void> { }

    /**
     * Hook: Xử lý trước khi xóa
     */
    protected async beforeDelete(id: string | number | bigint): Promise<boolean> {
        return true;
    }

    /**
     * Hook: Xử lý sau khi xóa
     */
    protected async afterDelete(id: string | number | bigint, entity?: any): Promise<void> { }

    /**
     * Hook: Chuẩn bị/Chỉnh sửa options (page, limit, sort) trước khi truy vấn.
     * Kế thừa logic giới hạn limit từ PrismaListService.
     */
    protected async prepareOptions(options: IPaginationOptions): Promise<IPaginationOptions> {
        const page = Math.max(Number(options.page) || 1, 1);
        const maxLimit = (options as any).maxLimit ?? 100;
        const limit = Math.min(Math.max(Number(options.limit) || 10, 1), maxLimit);
        const sort = options.sort || (this as any).defaultSort || 'id:DESC';

        return { ...options, page, limit, sort };
    }

    /**
     * Hook: Chuẩn bị filters.
     * Trả về filters đã xử lý, hoặc false để trả về kết quả rỗng ngay lập tức (Early Exit).
     * Tham khảo logic từ PrismaListService.
     */
    protected async prepareFilters(filters?: Record<string, any>, _options?: any): Promise<Record<string, any> | boolean | undefined> {
        return filters;
    }

    /**
     * Hook: Xử lý tập kết quả sau khi getList
     */
    protected async afterGetList(result: IPaginatedResult<T>): Promise<IPaginatedResult<T>> {
        return result;
    }

    /**
     * Hook: Xử lý item sau khi getOne (ngoài transform)
     */
    protected async afterGetOne(entity: T | null): Promise<T | null> {
        return entity;
    }

    /**
     * Lấy danh sách phân trang
     */
    async getList(options: IPaginationOptions = {}): Promise<IPaginatedResult<T>> {
        const normalized = await this.prepareOptions(options);
        const preparedFilters = await this.prepareFilters(normalized.filter, normalized);

        if (preparedFilters === false) {
            return {
                data: [],
                meta: createPaginationMeta(normalized.page as number, normalized.limit as number, 0)
            };
        }

        if (preparedFilters && typeof preparedFilters === 'object') {
            normalized.filter = preparedFilters;
        }

        const result = await this.repository.findAll(normalized);
        result.data = await Promise.all(
            result.data.map((item) => this.transform(item) as T)
        );

        return this.afterGetList(result);
    }

    /**
     * Lấy một bản ghi theo ID
     */
    async getOne(id: string | number | bigint, _options: IPaginationOptions = {}): Promise<T> {
        const entity = await this.repository.findById(id);
        if (!entity) {
            throw new NotFoundException(`Resource with ID ${id} not found`);
        }

        const transformed = this.transform(entity) as T;
        const final = await this.afterGetOne(transformed);

        if (!final) {
            throw new NotFoundException(`Resource with ID ${id} not found after processing`);
        }

        return final;
    }

    /**
     * Tạo mới
     */
    async create(data: any): Promise<T> {
        const payload = await this.beforeCreate(data);
        const entity = await this.repository.create(payload);
        await this.afterCreate(entity, data);
        return this.transform(entity) as T;
    }

    /**
     * Cập nhật
     */
    async update(id: string | number | bigint, data: any): Promise<T> {
        const payload = await this.beforeUpdate(id, data);
        const entity = await this.repository.update(id, payload);
        if (!entity) {
            throw new NotFoundException(`Resource with ID ${id} not found to update`);
        }
        await this.afterUpdate(entity, data);
        return this.transform(entity) as T;
    }

    /**
     * Xóa
     */
    async delete(id: string | number | bigint): Promise<any> {
        const canDelete = await this.beforeDelete(id);
        if (!canDelete) return false;

        const result = await this.repository.delete(id);
        if (result) {
            await this.afterDelete(id);
        }
        return result;
    }

    /**
     * Transform dữ liệu trả về (ví dụ: xử lý BigInt, ẩn field nhạy cảm)
     */
    protected transform(entity: T | null): T | null {
        if (!entity) return null;
        return this.deepConvertBigInt(entity);
    }

    /**
     * Helper để convert BigInt sang number trong object
     */
    protected deepConvertBigInt(obj: any): any {
        if (obj === null || obj === undefined) return obj;
        if (typeof obj === 'bigint') return Number(obj);
        if (Array.isArray(obj)) return obj.map((v) => this.deepConvertBigInt(v));
        if (typeof obj === 'object') {
            const res: any = {};
            for (const key in obj) {
                try {
                    res[key] = this.deepConvertBigInt(obj[key]);
                } catch (e) {
                    res[key] = obj[key];
                }
            }
            return res;
        }
        return obj;
    }
}
