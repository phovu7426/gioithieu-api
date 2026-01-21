import { Injectable } from '@nestjs/common';
import { PostComment as PrismaComment, PostViewStats as PrismaStats } from '@prisma/client';
import { PostComment, PostViewStats } from '@/domain/models/post-extended.model';
import { IMapper } from '../../mapper.interface';

@Injectable()
export class PostCommentMapper implements IMapper<PostComment, PrismaComment> {
    toDomain(raw: PrismaComment): PostComment {
        return PostComment.create(raw.id, {
            postId: raw.post_id,
            userId: raw.user_id || undefined,
            guestName: raw.guest_name || undefined,
            guestEmail: raw.guest_email || undefined,
            parentId: raw.parent_id || undefined,
            content: raw.content,
            status: raw.status,
            createdAt: raw.created_at,
            updatedAt: raw.updated_at,
            deletedAt: raw.deleted_at || undefined
        });
    }
    toPersistence(domain: PostComment): Partial<PrismaComment> {
        const obj = domain.toObject();
        return {
            id: domain.id,
            post_id: BigInt(obj.postId),
            user_id: obj.userId ? BigInt(obj.userId) : null,
            guest_name: obj.guestName || null,
            guest_email: obj.guestEmail || null,
            parent_id: obj.parentId ? BigInt(obj.parentId) : null,
            content: obj.content,
            status: obj.status as any,
            created_at: obj.createdAt,
            updated_at: obj.updatedAt,
            deleted_at: obj.deletedAt ? new Date(obj.deletedAt) : null
        };
    }
}

@Injectable()
export class PostViewStatsMapper implements IMapper<PostViewStats, PrismaStats> {
    toDomain(raw: PrismaStats): PostViewStats {
        return PostViewStats.create(raw.id, {
            postId: raw.post_id,
            viewDate: raw.view_date,
            viewCount: raw.view_count,
            updatedAt: raw.updated_at
        });
    }
    toPersistence(domain: PostViewStats): Partial<PrismaStats> {
        const obj = domain.toObject();
        return {
            id: domain.id,
            post_id: BigInt(obj.postId),
            view_date: new Date(obj.viewDate),
            view_count: obj.viewCount,
            updated_at: obj.updatedAt
        };
    }
}
