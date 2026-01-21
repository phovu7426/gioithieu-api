
import { Injectable } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { PrismaRepository } from '@/common/core/repositories';
import { IPostRepository, PostFilter } from './post.repository.interface';
import { RedisUtil } from '@/core/utils/redis.util';
import { IPaginationOptions, IPaginatedResult } from '@/common/core/repositories';
import { createPaginationMeta } from '@/common/core/utils';

@Injectable()
export class PostPrismaRepository extends PrismaRepository<
    Post,
    Prisma.PostWhereInput,
    Prisma.PostCreateInput,
    Prisma.PostUpdateInput,
    Prisma.PostOrderByWithRelationInput
> implements IPostRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisUtil,
    ) {
        // Cast strict delegate to generic handler if needed or ensure compatibility
        super(prisma.post as unknown as any);
    }

    // Define the default select structure to match what the 'Post' entity conceptually includes for the application
    private get defaultSelect(): Prisma.PostSelect {
        return {
            id: true,
            name: true,
            slug: true,
            excerpt: true,
            content: true,
            image: true,
            cover_image: true,
            primary_postcategory_id: true,
            status: true,
            post_type: true,
            video_url: true,
            audio_url: true,
            is_featured: true,
            is_pinned: true,
            published_at: true,
            view_count: true,
            meta_title: true,
            meta_description: true,
            canonical_url: true,
            og_title: true,
            og_description: true,
            og_image: true,
            group_id: true,
            created_at: true,
            updated_at: true,
            // Include relations
            primary_category: { select: { id: true, name: true, slug: true, status: true } },
            categories: {
                select: {
                    category: { select: { id: true, name: true, slug: true } },
                },
            },
            tags: {
                select: {
                    tag: { select: { id: true, name: true, slug: true } },
                },
            },
        };
    }

    protected buildWhere(filter: PostFilter): Prisma.PostWhereInput {
        const where: Prisma.PostWhereInput = {};

        if (filter.status) where.status = filter.status as any;

        if (filter.search) {
            where.OR = [
                { name: { contains: filter.search } },
                { slug: { contains: filter.search } },
            ];
        }

        if (filter.categorySlug) {
            where.categories = {
                some: {
                    category: { slug: filter.categorySlug },
                },
            };
        }

        if (filter.tagSlug) {
            where.tags = {
                some: {
                    tag: { slug: filter.tagSlug },
                },
            };
        }

        if (filter.categoryId) {
            where.categories = {
                some: {
                    category: { id: BigInt(filter.categoryId) },
                },
            };
        }

        if (filter.tagId) {
            where.tags = {
                some: {
                    tag: { id: BigInt(filter.tagId) },
                },
            };
        }

        if (filter.isFeatured !== undefined) where.is_featured = filter.isFeatured;
        if (filter.isPinned !== undefined) where.is_pinned = filter.isPinned;
        if (filter.deleted_at !== undefined) where.deleted_at = filter.deleted_at;
        else where.deleted_at = null; // Default to not deleted

        return where;
    }

    // Override findAll to include selections
    async findAll(options: IPaginationOptions & { filter?: PostFilter } = {}): Promise<IPaginatedResult<Post>> {
        const page = Math.max(Number(options.page) || 1, 1);
        const limit = Math.max(Number(options.limit) || 10, 1);
        const sort = options.sort || 'created_at:desc';

        const where = this.buildWhere(options.filter || {});
        const orderBy = this.parseSort(sort);

        const [data, total] = await Promise.all([
            this.prisma.post.findMany({
                where,
                select: this.defaultSelect,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.post.count({ where }),
        ]);

        // Note: The data returned here technically has more fields than 'Post' type (relations).
        // We cast it to 'Post' compatible type or strictly speaking, IRepository<Post> should return Post populated.
        // In a strict typed env, we might return PostWithRelations. 
        // For now we cast as any or return as is, assuming strictNullChecks are handled.
        return {
            data: data as unknown as Post[],
            meta: createPaginationMeta(page, limit, total),
        };
    }

    async findPublishedBySlug(slug: string): Promise<Post | null> {
        const post = await this.prisma.post.findFirst({
            where: {
                slug,
                status: 'published',
                deleted_at: null,
            },
            select: this.defaultSelect,
        });
        return post as unknown as Post;
    }

    async incrementViewCount(id: number | bigint): Promise<void> {
        try {
            // Logic copied/adapted from original service
            if (this.redis.isEnabled()) {
                await this.redis.hincrby('post:views:buffer', id.toString(), 1);
            } else {
                await this.prisma.post.update({
                    where: { id: BigInt(id) },
                    data: { view_count: { increment: 1 } },
                });
            }
        } catch (e) {
            // Fail silently for analytics
            console.error('Failed to increment view count', e);
        }
    }

    async syncRelations(postId: number | bigint, tagIds?: number[], categoryIds?: number[]): Promise<void> {
        const id = BigInt(postId);

        if (tagIds !== undefined && tagIds !== null) {
            await this.prisma.postPosttag.deleteMany({ where: { post_id: id } });
            if (tagIds.length > 0) {
                await this.prisma.postPosttag.createMany({
                    data: tagIds.map((tagId) => ({ post_id: id, posttag_id: BigInt(tagId) })),
                    skipDuplicates: true,
                });
            }
        }

        if (categoryIds !== undefined && categoryIds !== null) {
            await this.prisma.postPostcategory.deleteMany({ where: { post_id: id } });
            if (categoryIds.length > 0) {
                await this.prisma.postPostcategory.createMany({
                    data: categoryIds.map((catId) => ({ post_id: id, postcategory_id: BigInt(catId) })),
                    skipDuplicates: true,
                });
            }
        }
    }

    async getViewStats(postId: number | bigint, startDate: Date, endDate: Date): Promise<any[]> {
        return (this.prisma as any).postViewStats.findMany({
            where: {
                post_id: BigInt(postId),
                view_date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { view_date: 'asc' },
        });
    }

    async getStatisticsOverview(): Promise<any> {
        // Lấy tổng số bài viết theo trạng thái
        const totalPosts = await this.prisma.post.count({ where: { deleted_at: null } });
        const publishedPosts = await this.prisma.post.count({
            where: { status: 'published', deleted_at: null }
        });
        const draftPosts = await this.prisma.post.count({
            where: { status: 'draft', deleted_at: null }
        });
        const scheduledPosts = await this.prisma.post.count({
            where: { status: 'scheduled', deleted_at: null }
        });

        // Top 10 bài viết xem nhiều nhất
        const topViewedPosts = await this.prisma.post.findMany({
            where: { deleted_at: null, status: 'published' },
            select: {
                id: true,
                name: true,
                slug: true,
                view_count: true,
                published_at: true,
            },
            orderBy: { view_count: 'desc' },
            take: 10,
        });

        // Tổng số bình luận - using 'any' cast as model might not be generated in types if strictly checked or missing relation in some contexts
        const totalComments = await (this.prisma as any).postComment.count({
            where: { deleted_at: null },
        });

        // Số bình luận chờ duyệt (status: hidden)
        const pendingComments = await (this.prisma as any).postComment.count({
            where: { status: 'hidden', deleted_at: null },
        });

        // Thống kê lượt xem 30 ngày gần nhất
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentViews = await (this.prisma as any).postViewStats.aggregate({
            where: {
                view_date: { gte: thirtyDaysAgo },
            },
            _sum: { view_count: true },
        });

        return {
            total_posts: totalPosts,
            published_posts: publishedPosts,
            draft_posts: draftPosts,
            scheduled_posts: scheduledPosts,
            total_comments: totalComments,
            pending_comments: pendingComments,
            total_views_last_30_days: recentViews._sum.view_count || 0,
            top_viewed_posts: topViewedPosts,
        };
    }

    async batchIncrementViewCount(postId: number | bigint, count: number): Promise<void> {
        await this.prisma.post.update({
            where: { id: BigInt(postId) },
            data: { view_count: { increment: count } },
        });
    }

    async upsertViewStats(postId: number | bigint, viewDate: Date, count: number): Promise<void> {
        await (this.prisma as any).postViewStats.upsert({
            where: {
                post_id_view_date: {
                    post_id: BigInt(postId),
                    view_date: viewDate,
                },
            },
            create: {
                post_id: BigInt(postId),
                view_date: viewDate,
                view_count: count,
            },
            update: {
                view_count: { increment: count },
            },
        });
    }
}
