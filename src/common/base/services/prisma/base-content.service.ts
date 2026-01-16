import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaCrudService, PrismaCrudBag } from './prisma-crud.service';
import { StringUtil } from '@/core/utils/string.util';

/**
 * Base Service cho các Content Module (Project, News, Product, etc.)
 * Tích hợp sẵn các tính năng chung: Slug, Status, SortOrder, Featured, ViewCount
 */
@Injectable()
export abstract class BaseContentService<T extends PrismaCrudBag> extends PrismaCrudService<T> {

    /**
     * Helper: Đảm bảo slug luôn được tạo và là duy nhất
     */
    protected async ensureSlug(
        data: any,
        excludeId?: number,
        currentSlug?: string,
        slugField: string = 'slug',
        nameField: string = 'name'
    ): Promise<void> {
        // 1. Tạo slug từ name nếu chưa có
        if (data[nameField] && !data[slugField]) {
            data[slugField] = StringUtil.toSlug(data[nameField]);
        } else if (data[slugField]) {
            // 2. Chuẩn hóa slug nếu người dùng nhập
            data[slugField] = StringUtil.toSlug(data[slugField]);
        } else {
            // Không có name cũng không có slug -> return
            return;
        }

        const normalizedSlug = data[slugField];

        // 3. Nếu slug không thay đổi so với hiện tại -> Done
        if (currentSlug && normalizedSlug === currentSlug) {
            delete data[slugField];
            return;
        }

        // 4. Kiểm tra trùng lặp trong DB
        // Lưu ý: delegate phải hỗ trợ findFirst (mặc định Prisma delegate nào cũng có)
        const delegate = this.delegate as any;

        // Xây dựng condition check trùng
        const where: any = {
            [slugField]: normalizedSlug,
            deleted_at: null,
        };
        if (excludeId) {
            where.id = { not: BigInt(excludeId) };
        }

        const existing = await delegate.findFirst({ where });

        if (existing) {
            // 5. Nếu trùng, thêm hậu tố số đếm -1, -2, ...
            let counter = 1;
            let uniqueSlug = `${normalizedSlug}-${counter}`;

            while (await delegate.findFirst({
                where: { [slugField]: uniqueSlug, deleted_at: null }
            })) {
                counter++;
                uniqueSlug = `${normalizedSlug}-${counter}`;
            }
            data[slugField] = uniqueSlug;
        } else {
            // Nếu không trùng giữ nguyên
            data[slugField] = normalizedSlug;
        }
    }

    /**
     * Generic: Thay đổi trạng thái (active/inactive/...)
     */
    async changeStatus(id: number, status: string | any) {
        return this.update({ id: BigInt(id) } as any, { status } as any);
    }

    /**
     * Generic: Thay đổi thứ tự sắp xếp
     */
    async updateSortOrder(id: number, sortOrder: number) {
        return this.update({ id: BigInt(id) } as any, { sort_order: sortOrder } as any);
    }

    /**
     * Generic: Toggle Featured (Nổi bật)
     * Sử dụng try-catch để an toàn nếu model không có trường featured
     */
    async toggleFeatured(id: number, featured: boolean) {
        try {
            return await this.update({ id: BigInt(id) } as any, { featured } as any);
        } catch (error) {
            throw new Error('Model này không hỗ trợ tính năng Featured hoặc đã xảy ra lỗi DB.');
        }
    }

    /**
     * Generic: Tăng view count
     */
    async incrementViewCount(id: number, field: string = 'view_count') {
        // Check tồn tại trước
        const item = await (this.delegate as any).findFirst({
            where: { id: BigInt(id) },
        });

        if (!item) {
            throw new NotFoundException(`Item with ID ${id} not found`);
        }

        return (this.delegate as any).update({
            where: { id: BigInt(id) },
            data: { [field]: { increment: 1 } },
        });
    }
}
