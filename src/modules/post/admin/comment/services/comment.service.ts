import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaCrudService, PrismaCrudBag } from '@/common/base/services/prisma/prisma-crud.service';
import { PrismaService } from '@/core/database/prisma/prisma.service';

type AdminPostCommentBag = PrismaCrudBag & {
    Model: Prisma.PostCommentGetPayload<{
        include: {
            post: { select: { id: true; name: true; slug: true } };
            user: { select: { id: true; name: true; email: true } };
        };
    }>;
    Where: Prisma.PostCommentWhereInput;
    Select: Prisma.PostCommentSelect;
    Include: Prisma.PostCommentInclude;
    OrderBy: Prisma.PostCommentOrderByWithRelationInput;
    Create: Prisma.PostCommentUncheckedCreateInput;
    Update: Prisma.PostCommentUncheckedUpdateInput;
};

@Injectable()
export class AdminPostCommentService extends PrismaCrudService<AdminPostCommentBag> {
    constructor(private readonly prisma: PrismaService) {
        super((prisma as any).postComment, ['id', 'created_at', 'status'], 'created_at:DESC');
    }

    protected override async prepareFilters(filters: any = {}) {
        const prepared: any = { ...filters };

        // Luôn lọc bỏ những comment đã bị xoá mềm
        prepared.deleted_at = null;

        if (prepared.post_id) {
            prepared.post_id = BigInt(prepared.post_id);
        }

        return prepared;
    }

    protected override prepareOptions(queryOptions: any = {}) {
        const base = super.prepareOptions(queryOptions);
        const defaultSelect: Prisma.PostCommentSelect = {
            id: true,
            post_id: true,
            user_id: true,
            guest_name: true,
            guest_email: true,
            parent_id: true,
            content: true,
            status: true,
            created_at: true,
            post: { select: { id: true, name: true, slug: true } },
            user: { select: { id: true, name: true, email: true } },
        };

        return {
            ...base,
            select: queryOptions?.select ?? defaultSelect,
            include: undefined,
        };
    }

    async updateCommentStatus(id: number | bigint, status: 'visible' | 'hidden') {
        return this.update({ id: BigInt(id) } as any, { status });
    }

    async deleteComment(id: number | bigint) {
        return this.delete({ id: BigInt(id) } as any);
    }
}
