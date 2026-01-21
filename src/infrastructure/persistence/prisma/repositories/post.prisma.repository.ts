import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { IPostRepository } from '@/domain/repositories/post.repository.interface';
import { Post } from '@/domain/models/post.model';
import { PostMapper } from '../mappers/post.mapper';

@Injectable()
export class PostPrismaRepository implements IPostRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mapper: PostMapper,
    ) { }

    async findById(id: bigint): Promise<Post | null> {
        const raw = await this.prisma.post.findFirst({
            where: { id, deleted_at: null },
            include: {
                categories: true,
                tags: true,
            },
        });
        return raw ? this.mapper.toDomain(raw) : null;
    }

    async findBySlug(slug: string): Promise<Post | null> {
        const raw = await this.prisma.post.findFirst({
            where: { slug, deleted_at: null },
            include: {
                categories: true,
                tags: true,
            },
        });
        return raw ? this.mapper.toDomain(raw) : null;
    }

    async findAll(): Promise<Post[]> {
        const rawList = await this.prisma.post.findMany({
            where: { deleted_at: null },
            include: {
                categories: true,
                tags: true,
            },
        });
        return rawList.map(raw => this.mapper.toDomain(raw));
    }

    async findPublished(options: {
        page: number;
        limit: number;
        categoryId?: bigint;
        tagId?: bigint;
        search?: string;
    }): Promise<{ items: Post[]; total: number }> {
        const { page, limit, categoryId, tagId, search } = options;
        const skip = (page - 1) * limit;

        const where: any = {
            status: 'published',
            deleted_at: null,
            published_at: { lte: new Date() },
        };

        if (categoryId) {
            where.categories = { some: { postcategory_id: categoryId } };
        }

        if (tagId) {
            where.tags = { some: { posttag_id: tagId } };
        }

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { excerpt: { contains: search } },
                { content: { contains: search } },
            ];
        }

        const [rawList, total] = await Promise.all([
            this.prisma.post.findMany({
                where,
                include: { categories: true, tags: true },
                orderBy: { published_at: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.post.count({ where }),
        ]);

        return {
            items: rawList.map(raw => this.mapper.toDomain(raw)),
            total,
        };
    }

    async findFeatured(limit: number): Promise<Post[]> {
        const rawList = await this.prisma.post.findMany({
            where: {
                status: 'published',
                is_featured: true,
                deleted_at: null,
            },
            include: { categories: true, tags: true },
            orderBy: { published_at: 'desc' },
            take: limit,
        });
        return rawList.map(raw => this.mapper.toDomain(raw));
    }

    async findWithPagination(options: {
        page: number;
        limit: number;
        status?: string;
        categoryId?: bigint;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{ items: Post[]; total: number; page: number; limit: number; lastPage: number }> {
        const { page, limit, status, categoryId, search, sortBy = 'created_at', sortOrder = 'desc' } = options;
        const skip = (page - 1) * limit;

        const where: any = { deleted_at: null };
        if (status) where.status = status;
        if (categoryId) where.categories = { some: { postcategory_id: categoryId } };
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { slug: { contains: search } },
            ];
        }

        const [rawList, total] = await Promise.all([
            this.prisma.post.findMany({
                where,
                include: { categories: true, tags: true },
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: limit,
            }),
            this.prisma.post.count({ where }),
        ]);

        return {
            items: rawList.map(raw => this.mapper.toDomain(raw)),
            total,
            page,
            limit,
            lastPage: Math.ceil(total / limit),
        };
    }

    async save(entity: Post): Promise<Post> {
        const data = this.mapper.toCreateInput(entity);
        const raw = await this.prisma.post.create({
            data,
            include: { categories: true, tags: true },
        });
        return this.mapper.toDomain(raw);
    }

    async update(entity: Post): Promise<Post> {
        const data = this.mapper.toUpdateInput(entity);

        // Complex relation sync (categories/tags)
        // For simplicity in this step, we'll delete and recreate relations if they changed
        // In a real high-perf scenario, we'd use connect/disconnect

        await this.prisma.$transaction(async (tx) => {
            // Clear old relations
            await tx.postPostcategory.deleteMany({ where: { post_id: entity.id } });
            await tx.postPosttag.deleteMany({ where: { post_id: entity.id } });

            // Update post
            await tx.post.update({
                where: { id: entity.id },
                data: {
                    ...data,
                    categories: {
                        create: entity.categoryIds.map(id => ({ postcategory_id: id }))
                    },
                    tags: {
                        create: entity.tagIds.map(id => ({ posttag_id: id }))
                    }
                },
            });
        });

        return this.findById(entity.id) as Promise<Post>;
    }

    async delete(id: bigint): Promise<boolean> {
        try {
            await this.prisma.post.update({
                where: { id },
                data: { deleted_at: new Date() },
            });
            return true;
        } catch {
            return false;
        }
    }

    async exists(id: bigint): Promise<boolean> {
        const count = await this.prisma.post.count({
            where: { id, deleted_at: null },
        });
        return count > 0;
    }

    async updateViewCount(id: bigint, count: bigint): Promise<void> {
        await this.prisma.post.update({
            where: { id },
            data: { view_count: { increment: count } },
        });
    }
}
