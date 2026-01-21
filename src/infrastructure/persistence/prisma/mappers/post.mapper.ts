import { Injectable } from '@nestjs/common';
import { Post as PrismaPost, PostStatus as PrismaPostStatus } from '@prisma/client';
import { Post } from '@/domain/models/post.model';
import { PostStatus } from '@/domain/value-objects/post-status.vo';
import { IMapper } from '../../mapper.interface';

@Injectable()
export class PostMapper implements IMapper<Post, PrismaPost> {
    toDomain(raw: any): Post {
        // raw here is expected to be PrismaPost with relations (categories, tags)
        return Post.create(raw.id, {
            name: raw.name,
            slug: raw.slug,
            excerpt: raw.excerpt || undefined,
            content: raw.content,
            image: raw.image || undefined,
            coverImage: raw.cover_image || undefined,
            primaryCategoryId: raw.primary_postcategory_id || undefined,
            status: PostStatus.fromString(raw.status),
            postType: raw.post_type,
            videoUrl: raw.video_url || undefined,
            audioUrl: raw.audio_url || undefined,
            isFeatured: raw.is_featured,
            isPinned: raw.is_pinned,
            publishedAt: raw.published_at || undefined,
            viewCount: raw.view_count,
            metaTitle: raw.meta_title || undefined,
            metaDescription: raw.meta_description || undefined,
            canonicalUrl: raw.canonical_url || undefined,
            ogTitle: raw.og_title || undefined,
            ogDescription: raw.og_description || undefined,
            ogImage: raw.og_image || undefined,
            groupId: raw.group_id || undefined,
            createdUserId: raw.created_user_id || undefined,
            updatedUserId: raw.updated_user_id || undefined,
            createdAt: raw.created_at,
            updatedAt: raw.updated_at,
            deletedAt: raw.deleted_at || undefined,
            // Handle relations if they exist in raw
            categoryIds: raw.categories?.map((c: any) => c.postcategory_id) || [],
            tagIds: raw.tags?.map((t: any) => t.posttag_id) || [],
        });
    }

    toPersistence(domain: Post): Partial<PrismaPost> {
        const obj = domain.toObject();
        return {
            id: domain.id,
            name: obj.name,
            slug: obj.slug,
            excerpt: obj.excerpt || null,
            content: obj.content,
            image: obj.image || null,
            cover_image: obj.coverImage || null,
            primary_postcategory_id: obj.primaryCategoryId || null,
            status: obj.status as PrismaPostStatus,
            post_type: obj.postType as any,
            video_url: obj.videoUrl || null,
            audio_url: obj.audioUrl || null,
            is_featured: obj.isFeatured,
            is_pinned: obj.isPinned,
            published_at: obj.publishedAt ? new Date(obj.publishedAt) : null,
            view_count: BigInt(obj.viewCount),
            meta_title: obj.metaTitle || null,
            meta_description: obj.metaDescription || null,
            canonical_url: obj.canonicalUrl || null,
            og_title: obj.ogTitle || null,
            og_description: obj.ogDescription || null,
            og_image: obj.ogImage || null,
            group_id: obj.groupId || null,
            created_user_id: obj.createdUserId || null,
            updated_user_id: obj.updatedUserId || null,
            created_at: obj.createdAt,
            updated_at: obj.updatedAt,
            deleted_at: obj.deletedAt ? new Date(obj.deletedAt) : null,
        };
    }

    toCreateInput(domain: Post): any {
        const persistence = this.toPersistence(domain);
        delete persistence.id;
        delete persistence.created_at;
        delete persistence.updated_at;
        delete persistence.deleted_at;

        // Add relation logic for create
        const data: any = { ...persistence };

        if (domain.categoryIds.length > 0) {
            data.categories = {
                create: domain.categoryIds.map(id => ({ postcategory_id: id }))
            };
        }

        if (domain.tagIds.length > 0) {
            data.tags = {
                create: domain.tagIds.map(id => ({ posttag_id: id }))
            };
        }

        return data;
    }

    toUpdateInput(domain: Post): any {
        const persistence = this.toPersistence(domain);
        delete persistence.id;
        delete persistence.created_at;
        delete persistence.view_count; // Don't update view_count via standard update

        const data: any = { ...persistence };

        // Note: Relation updates usually need specialized handling in Repository 
        // to handle connect/disconnect/delete
        return data;
    }
}
