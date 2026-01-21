import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { IPostCommentRepository, IPostViewStatsRepository } from '@/domain/repositories/post-extended.repository.interface';
import { PostComment, PostViewStats } from '@/domain/models/post-extended.model';
import { PostCommentMapper, PostViewStatsMapper } from '../mappers/post-extended.mapper';

@Injectable()
export class PostCommentPrismaRepository implements IPostCommentRepository {
    constructor(private readonly prisma: PrismaService, private readonly mapper: PostCommentMapper) { }
    async findById(id: bigint) { const raw = await this.prisma.postComment.findFirst({ where: { id, deleted_at: null } }); return raw ? this.mapper.toDomain(raw) : null; }
    async findByPost(postId: bigint) { const list = await this.prisma.postComment.findMany({ where: { post_id: postId, deleted_at: null }, orderBy: { created_at: 'desc' } }); return list.map(r => this.mapper.toDomain(r)); }
    async findReplies(parentId: bigint) { const list = await this.prisma.postComment.findMany({ where: { parent_id: parentId, deleted_at: null }, orderBy: { created_at: 'asc' } }); return list.map(r => this.mapper.toDomain(r)); }
    async findAll() { const list = await this.prisma.postComment.findMany({ where: { deleted_at: null } }); return list.map(r => this.mapper.toDomain(r)); }
    async save(entity: PostComment) { const data = this.mapper.toPersistence(entity); delete data.id; const raw = await this.prisma.postComment.create({ data: data as any }); return this.mapper.toDomain(raw); }
    async update(entity: PostComment) { const data = this.mapper.toPersistence(entity); delete data.id; const raw = await this.prisma.postComment.update({ where: { id: entity.id }, data: data as any }); return this.mapper.toDomain(raw); }
    async delete(id: bigint) { try { await this.prisma.postComment.update({ where: { id }, data: { deleted_at: new Date() } }); return true; } catch { return false; } }
    async exists(id: bigint) { return (await this.prisma.postComment.count({ where: { id, deleted_at: null } })) > 0; }
}

@Injectable()
export class PostViewStatsPrismaRepository implements IPostViewStatsRepository {
    constructor(private readonly prisma: PrismaService, private readonly mapper: PostViewStatsMapper) { }
    async findById(id: bigint) { const raw = await this.prisma.postViewStats.findUnique({ where: { id } }); return raw ? this.mapper.toDomain(raw) : null; }
    async findByPostAndDate(postId: bigint, date: Date) {
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const raw = await this.prisma.postViewStats.findUnique({ where: { post_id_view_date: { post_id: postId, view_date: startOfDay } } });
        return raw ? this.mapper.toDomain(raw) : null;
    }
    async incrementView(postId: bigint, date: Date) {
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        await this.prisma.postViewStats.upsert({
            where: { post_id_view_date: { post_id: postId, view_date: startOfDay } },
            create: { post_id: postId, view_date: startOfDay, view_count: 1 },
            update: { view_count: { increment: 1 } }
        });
    }
    async findAll() { return []; }
    async save(entity: PostViewStats) { return entity; } // Handled by incrementView usually
    async update(entity: PostViewStats) { return entity; }
    async delete(id: bigint) { return true; }
    async exists(id: bigint) { return true; }
}
