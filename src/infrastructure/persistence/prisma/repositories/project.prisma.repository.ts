import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { IProjectRepository } from '@/domain/repositories/project.repository.interface';
import { Project } from '@/domain/models/project.model';
import { ProjectMapper } from '../mappers/project.mapper';

@Injectable()
export class ProjectPrismaRepository implements IProjectRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mapper: ProjectMapper,
    ) { }

    async findById(id: bigint): Promise<Project | null> {
        const raw = await this.prisma.project.findFirst({
            where: { id, deleted_at: null },
        });
        return raw ? this.mapper.toDomain(raw) : null;
    }

    async findBySlug(slug: string): Promise<Project | null> {
        const raw = await this.prisma.project.findFirst({
            where: { slug, deleted_at: null },
        });
        return raw ? this.mapper.toDomain(raw) : null;
    }

    async findAll(): Promise<Project[]> {
        const rawList = await this.prisma.project.findMany({
            where: { deleted_at: null },
            orderBy: { sort_order: 'asc' },
        });
        return rawList.map(raw => this.mapper.toDomain(raw));
    }

    async findFeatured(limit: number): Promise<Project[]> {
        const rawList = await this.prisma.project.findMany({
            where: { featured: true, deleted_at: null },
            orderBy: { sort_order: 'asc' },
            take: limit,
        });
        return rawList.map(raw => this.mapper.toDomain(raw));
    }

    async findActive(): Promise<Project[]> {
        const rawList = await this.prisma.project.findMany({
            where: {
                status: { notIn: ['cancelled'] },
                deleted_at: null
            },
            orderBy: { sort_order: 'asc' },
        });
        return rawList.map(raw => this.mapper.toDomain(raw));
    }

    async save(entity: Project): Promise<Project> {
        const data = this.mapper.toPersistence(entity);
        delete data.id;
        delete data.created_at;
        delete data.updated_at;
        delete data.deleted_at;
        const raw = await this.prisma.project.create({ data: data as any });
        return this.mapper.toDomain(raw);
    }

    async update(entity: Project): Promise<Project> {
        const data = this.mapper.toPersistence(entity);
        delete data.id;
        delete data.created_at;
        const raw = await this.prisma.project.update({
            where: { id: entity.id },
            data: data as any,
        });
        return this.mapper.toDomain(raw);
    }

    async delete(id: bigint): Promise<boolean> {
        try {
            await this.prisma.project.update({
                where: { id },
                data: { deleted_at: new Date() },
            });
            return true;
        } catch {
            return false;
        }
    }

    async exists(id: bigint): Promise<boolean> {
        const count = await this.prisma.project.count({
            where: { id, deleted_at: null },
        });
        return count > 0;
    }
}
