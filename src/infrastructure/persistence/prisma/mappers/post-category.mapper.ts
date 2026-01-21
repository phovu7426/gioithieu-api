import { Injectable } from '@nestjs/common';
import { PostCategory as PrismaCategory } from '@prisma/client';
import { PostCategory } from '@/domain/models/post-category.model';
import { Status } from '@/domain/value-objects/status.vo';
import { IMapper } from '../../mapper.interface';

@Injectable()
export class PostCategoryMapper implements IMapper<PostCategory, PrismaCategory> {
    toDomain(raw: PrismaCategory): PostCategory {
        return PostCategory.create(raw.id, {
            name: raw.name,
            slug: raw.slug,
            description: raw.description || undefined,
            parentId: raw.parent_id || undefined,
            image: raw.image || undefined,
            status: Status.fromString(raw.status),
            metaTitle: raw.meta_title || undefined,
            metaDescription: raw.meta_description || undefined,
            canonicalUrl: raw.canonical_url || undefined,
            ogImage: raw.og_image || undefined,
            sortOrder: raw.sort_order,
            createdUserId: raw.created_user_id || undefined,
            updatedUserId: raw.updated_user_id || undefined,
            createdAt: raw.created_at,
            updatedAt: raw.updated_at,
            deletedAt: raw.deleted_at || undefined,
        });
    }

    toPersistence(domain: PostCategory): Partial<PrismaCategory> {
        const obj = domain.toObject();
        return {
            id: domain.id,
            name: obj.name,
            slug: obj.slug,
            description: obj.description || null,
            parent_id: obj.parentId || null,
            image: obj.image || null,
            status: obj.status as any,
            meta_title: obj.metaTitle || null,
            meta_description: obj.metaDescription || null,
            canonical_url: obj.canonicalUrl || null,
            og_image: obj.ogImage || null,
            sort_order: obj.sortOrder,
            created_user_id: obj.createdUserId || null,
            updated_user_id: obj.updatedUserId || null,
            created_at: obj.createdAt,
            updated_at: obj.updatedAt,
            deleted_at: obj.deletedAt ? new Date(obj.deletedAt) : null,
        };
    }
}
