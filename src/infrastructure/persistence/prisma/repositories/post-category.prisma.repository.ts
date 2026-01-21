import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { IPostCategoryRepository } from '@/domain/repositories/post-category.repository.interface';
import { PostCategory } from '@/domain/models/post-category.model';
import { PostCategoryMapper } from '../mappers/post-category.mapper';

@Injectable()
export class PostCategoryPrismaRepository implements IPostCategoryRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mapper: PostCategoryMapper,
    ) { }

    async findById(id: bigint): Promise<PostCategory | null> {
        const raw = await this.prisma.postCategory.findFirst({
            where: { id, deleted_at: null },
        });
        return raw ? this.mapper.toDomain(raw) : null;
    }

    async findBySlug(slug: string): Promise<PostCategory | null> {
        const raw = await this.prisma.postCategory.findFirst({
            where: { slug, deleted_at: null },
        });
        return raw ? this.mapper.toDomain(raw) : null;
    }

    async findAll(): Promise<PostCategory[]> {
        const rawList = await this.prisma.postCategory.findMany({
            where: { deleted_at: null },
            orderBy: { sort_order: 'asc' },
        });
        return rawList.map(raw => this.mapper.toDomain(raw));
    }

    async findActive(): Promise<PostCategory[]> {
        const rawList = await this.prisma.postCategory.findMany({
            where: { status: 'active', deleted_at: null },
            orderBy: { sort_order: 'asc' },
        });
        return rawList.map(raw => this.mapper.toDomain(raw));
    }

    async findChildren(parentId: bigint): Promise<PostCategory[]> {
        const rawList = await this.prisma.postCategory.findMany({
            where: { parent_id: parentId, deleted_at: null },
            orderBy: { sort_order: 'asc' },
        });
        return rawList.map(raw => this.mapper.toDomain(raw));
    }

    async save(entity: PostCategory): Promise<PostCategory> {
        const persistence = this.mapper.toPersistence(entity);
        delete persistence.id;
        delete persistence.created_at;
        delete persistence.updated_at;
        delete persistence.deleted_at;

        const raw = await this.prisma.postCategory.create({
            data: persistence as any,
        });
        return this.mapper.toDomain(raw);
    }

    async update(entity: PostCategory): Promise<PostCategory> {
        const persistence = this.mapper.toPersistence(entity);
        delete persistence.id;
        delete persistence.created_at;

        const raw = await this.prisma.postCategory.update({
            where: { id: entity.id },
            data: persistence as any,
        });
        return this.mapper.toDomain(raw);
    }

    async delete(id: bigint): Promise<boolean> {
        try {
            await this.prisma.postCategory.update({
                where: { id },
                data: { deleted_at: new Date() },
            });
            return true;
        } catch {
            return false;
        }
    }

    async exists(id: bigint): Promise<boolean> {
        const count = await this.prisma.postCategory.count({
            where: { id, deleted_at: null },
        });
        return count > 0;
    }
}
