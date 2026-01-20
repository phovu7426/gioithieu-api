import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaListService, PrismaListBag } from '@/common/base/services/prisma/prisma-list.service';
import { PrismaService } from '@/core/database/prisma/prisma.service';

type PostCommentBag = PrismaListBag & {
    Model: Prisma.PostCommentGetPayload<{
        include: {
            user: { select: { id: true; name: true; image: true } };
            _count: { select: { replies: true } };
        };
    }>;
    Where: Prisma.PostCommentWhereInput;
    Select: Prisma.PostCommentSelect;
    Include: Prisma.PostCommentInclude;
    OrderBy: Prisma.PostCommentOrderByWithRelationInput;
};

@Injectable()
export class PostCommentService extends PrismaListService<PostCommentBag> {
    constructor(private readonly prisma: PrismaService) {
        super((prisma as any).postComment, ['id', 'created_at'], 'created_at:ASC');
    }

    protected override prepareOptions(queryOptions: any = {}) {
        const base = super.prepareOptions(queryOptions);
        return {
            ...base,
            select: queryOptions?.select ?? {
                id: true,
                post_id: true,
                user_id: true,
                guest_name: true,
                guest_email: true,
                parent_id: true,
                content: true,
                status: true,
                created_at: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                _count: {
                    select: { replies: true }
                }
            },
        };
    }

    async createComment(data: {
        post_id: number | bigint;
        user_id?: number | bigint;
        guest_name?: string;
        guest_email?: string;
        content: string;
        parent_id?: number | bigint;
    }) {
        const post = await this.prisma.post.findUnique({
            where: { id: BigInt(data.post_id) },
        });
        if (!post) throw new NotFoundException('Post not found');

        if (data.parent_id) {
            const parent = await (this.prisma as any).postComment.findUnique({
                where: { id: BigInt(data.parent_id) },
            });
            if (!parent) throw new NotFoundException('Parent comment not found');
            if (parent.post_id !== BigInt(data.post_id)) {
                throw new ForbiddenException('Parent comment belongs to a different post');
            }
        }

        return (this.prisma as any).postComment.create({
            data: {
                post_id: BigInt(data.post_id),
                user_id: data.user_id ? BigInt(data.user_id) : null,
                guest_name: data.guest_name,
                guest_email: data.guest_email,
                content: data.content,
                parent_id: data.parent_id ? BigInt(data.parent_id) : null,
                status: 'visible',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });
    }

    /**
     * Lấy danh sách comment theo bài viết (hỗ trợ phân trang và nested tree)
     * Cách tiếp cận "Hợp lý": 
     * 1. Phân trang trên các Root Comments (những bình luận không có parent_id).
     * 2. Tải toàn bộ cây của những Root Comments đó.
     */
    async getCommentsByPost(postId: number | bigint, options: { page?: number, limit?: number } = {}) {
        // 1. Phân trang trên Root Comments
        const rootsResult = await this.getList({
            post_id: BigInt(postId),
            parent_id: null,
            status: 'visible' as any,
            deleted_at: null,
        }, {
            page: options.page || 1,
            limit: options.limit || 10,
            sort: 'created_at:DESC' // Root mới nhất thường lên trên hoặc tùy UI
        });

        if (rootsResult.data.length === 0) return rootsResult;

        // 2. Lấy ID của các roots trong trang này
        const rootIdsInPage = rootsResult.data.map(r => r.id);

        /**
         * 3. Lấy toàn bộ descendants (con, cháu...) của các rootIds này.
         * Vì Prisma không hỗ trợ đệ quy sâu linh hoạt, ở quy mô bình thường, 
         * ta có thể lấy toàn bộ comments của post này và dựng lại cây.
         */
        const allComments = await (this.prisma as any).postComment.findMany({
            where: {
                post_id: BigInt(postId),
                status: 'visible',
                deleted_at: null,
            },
            include: {
                user: { select: { id: true, name: true, image: true } },
                _count: { select: { replies: true } }
            },
            orderBy: { created_at: 'asc' },
        });

        // 4. Dựng cây từ tập hợp rỗng và lọc lấy những cây có gốc nằm trong trang hiện tại
        const fullTree = this.buildCommentTree(allComments);
        const rootIdsSet = new Set(rootIdsInPage.map(id => id.toString()));
        const pagedTree = fullTree.filter(node => rootIdsSet.has(node.id.toString()));

        return {
            data: pagedTree,
            meta: rootsResult.meta
        };
    }

    private buildCommentTree(comments: any[]) {
        const map = new Map();
        const roots: any[] = [];

        comments.forEach(comment => {
            comment.replies = [];
            map.set(comment.id.toString(), comment);
        });

        comments.forEach(comment => {
            if (comment.parent_id) {
                const parent = map.get(comment.parent_id.toString());
                if (parent) {
                    parent.replies.push(comment);
                } else {
                    roots.push(comment);
                }
            } else {
                roots.push(comment);
            }
        });

        return roots;
    }
}
