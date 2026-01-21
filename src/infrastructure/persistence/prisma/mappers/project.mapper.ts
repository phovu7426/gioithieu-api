import { Injectable } from '@nestjs/common';
import { Project as PrismaProject, ProjectStatus as PrismaProjectStatus } from '@prisma/client';
import { Project } from '@/domain/models/project.model';
import { IMapper } from '../../mapper.interface';

@Injectable()
export class ProjectMapper implements IMapper<Project, PrismaProject> {
    toDomain(raw: PrismaProject): Project {
        return Project.create(raw.id, {
            name: raw.name,
            slug: raw.slug,
            description: raw.description || undefined,
            shortDescription: raw.short_description || undefined,
            coverImage: raw.cover_image || undefined,
            location: raw.location || undefined,
            area: raw.area ? Number(raw.area) : undefined,
            startDate: raw.start_date || undefined,
            endDate: raw.end_date || undefined,
            status: raw.status,
            clientName: raw.client_name || undefined,
            budget: raw.budget ? Number(raw.budget) : undefined,
            images: raw.images,
            featured: raw.featured,
            viewCount: raw.view_count,
            sortOrder: raw.sort_order,
            metaTitle: raw.meta_title || undefined,
            metaDescription: raw.meta_description || undefined,
            canonicalUrl: raw.canonical_url || undefined,
            ogImage: raw.og_image || undefined,
            createdAt: raw.created_at,
            updatedAt: raw.updated_at,
            deletedAt: raw.deleted_at || undefined,
        });
    }

    toPersistence(domain: Project): Partial<PrismaProject> {
        const obj = domain.toObject();
        return {
            id: domain.id,
            name: obj.name,
            slug: obj.slug,
            description: obj.description || null,
            short_description: obj.shortDescription || null,
            cover_image: obj.coverImage || null,
            location: obj.location || null,
            area: obj.area as any,
            start_date: obj.startDate ? new Date(obj.startDate) : null,
            end_date: obj.endDate ? new Date(obj.endDate) : null,
            status: obj.status as PrismaProjectStatus,
            client_name: obj.clientName || null,
            budget: obj.budget as any,
            images: obj.images || null,
            featured: obj.featured,
            view_count: BigInt(obj.viewCount),
            sort_order: obj.sortOrder,
            meta_title: obj.metaTitle || null,
            meta_description: obj.metaDescription || null,
            canonical_url: obj.canonicalUrl || null,
            og_image: obj.ogImage || null,
            created_at: obj.createdAt,
            updated_at: obj.updatedAt,
            deleted_at: obj.deletedAt ? new Date(obj.deletedAt) : null,
        };
    }
}
