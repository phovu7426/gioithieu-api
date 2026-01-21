
import { Injectable } from '@nestjs/common';
import { PostComment, Prisma } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { PrismaRepository } from '@/common/core/repositories';
import { IPostCommentRepository, PostCommentFilter } from './post-comment.repository.interface';

@Injectable()
export class PostCommentPrismaRepository extends PrismaRepository<
    PostComment,
    Prisma.PostCommentWhereInput,
    Prisma.PostCommentCreateInput,
    Prisma.PostCommentUpdateInput,
    Prisma.PostCommentOrderByWithRelationInput
> implements IPostCommentRepository {
    private readonly defaultSelect: Prisma.PostCommentSelect = {
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

    constructor(private readonly prisma: PrismaService) {
        super(prisma.postComment as unknown as any);
    }

    override async findAll(options: any): Promise<any> {
        return super.findAll({ ...options, select: this.defaultSelect });
    }

    override async findById(id: string | number | bigint): Promise<PostComment | null> {
        return this.prisma.postComment.findUnique({
            where: { id: BigInt(id) },
            select: this.defaultSelect as any,
        }) as unknown as PostComment;
    }

    protected buildWhere(filter: PostCommentFilter): Prisma.PostCommentWhereInput {
        const where: Prisma.PostCommentWhereInput = {};

        if (filter.postId) where.post_id = BigInt(filter.postId);
        if (filter.userId) where.user_id = BigInt(filter.userId);
        if (filter.status) where.status = filter.status as any;
        if (filter.parentId !== undefined) {
            where.parent_id = filter.parentId === null ? null : BigInt(filter.parentId);
        }
        if (filter.search) {
            where.content = { contains: filter.search };
        }

        where.deleted_at = null;

        return where;
    }

    async findWithReplies(postId: number | bigint): Promise<PostComment[]> {
        return this.prisma.postComment.findMany({
            where: {
                post_id: BigInt(postId),
                parent_id: null,
                deleted_at: null,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                replies: {
                    where: { deleted_at: null },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            },
                        },
                    },
                },
            },
            orderBy: { created_at: 'desc' },
        }) as unknown as PostComment[];
    }

    async updateStatus(id: number | bigint, status: string): Promise<PostComment> {
        return this.prisma.postComment.update({
            where: { id: BigInt(id) },
            data: { status: status as any },
        });
    }

    // Override calculate total if needed, but base should work.
}
