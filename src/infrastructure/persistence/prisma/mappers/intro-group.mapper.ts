import { Injectable } from '@nestjs/common';
import { Gallery as PrismaGallery, Partner as PrismaPartner, Faq as PrismaFaq, Testimonial as PrismaTestimonial } from '@prisma/client';
import { Gallery } from '@/domain/models/gallery.model';
import { Partner } from '@/domain/models/partner.model';
import { Faq } from '@/domain/models/faq.model';
import { Testimonial } from '@/domain/models/testimonial.model';
import { Status } from '@/domain/value-objects/status.vo';
import { IMapper } from '../../mapper.interface';

@Injectable() override export class GalleryMapper implements IMapper<Gallery, PrismaGallery> {
    toDomain(raw: PrismaGallery): Gallery {
        return Gallery.create(raw.id, {
            title: raw.title, slug: raw.slug, description: raw.description || undefined,
            coverImage: raw.cover_image || undefined, images: raw.images, featured: raw.featured,
            status: Status.fromString(raw.status), sortOrder: raw.sort_order,
            createdAt: raw.created_at, updatedAt: raw.updated_at, deletedAt: raw.deleted_at || undefined,
        });
    }
    toPersistence(domain: Gallery): Partial<PrismaGallery> {
        const obj = domain.toObject();
        return {
            id: domain.id, title: obj.title, slug: obj.slug, description: obj.description || null,
            cover_image: obj.coverImage || null, images: obj.images || null, featured: obj.featured,
            status: obj.status as any, sort_order: obj.sortOrder, created_at: obj.createdAt,
            updated_at: obj.updatedAt, deleted_at: obj.deletedAt ? new Date(obj.deletedAt) : null,
        };
    }
}

@Injectable() export class PartnerMapper implements IMapper<Partner, PrismaPartner> {
    toDomain(raw: PrismaPartner): Partner {
        return Partner.create(raw.id, {
            name: raw.name, logo: raw.logo, website: raw.website || undefined,
            description: raw.description || undefined, type: raw.type,
            status: Status.fromString(raw.status), sortOrder: raw.sort_order,
            createdAt: raw.created_at, updatedAt: raw.updated_at, deletedAt: raw.deleted_at || undefined,
        });
    }
    toPersistence(domain: Partner): Partial<PrismaPartner> {
        const obj = domain.toObject();
        return {
            id: domain.id, name: obj.name, logo: obj.logo, website: obj.website || null,
            description: obj.description || null, type: obj.type as any, status: obj.status as any,
            sort_order: obj.sortOrder, created_at: obj.createdAt, updated_at: obj.updatedAt,
            deleted_at: obj.deletedAt ? new Date(obj.deletedAt) : null,
        };
    }
}

@Injectable() export class FaqMapper implements IMapper<Faq, PrismaFaq> {
    toDomain(raw: PrismaFaq): Faq {
        return Faq.create(raw.id, {
            question: raw.question, answer: raw.answer, viewCount: raw.view_count,
            helpfulCount: raw.helpful_count, status: Status.fromString(raw.status),
            sortOrder: raw.sort_order, createdAt: raw.created_at, updatedAt: raw.updated_at,
            deletedAt: raw.deleted_at || undefined,
        });
    }
    toPersistence(domain: Faq): Partial<PrismaFaq> {
        const obj = domain.toObject();
        return {
            id: domain.id, question: obj.question, answer: obj.answer,
            view_count: BigInt(obj.viewCount), helpful_count: BigInt(obj.helpfulCount),
            status: obj.status as any, sort_order: obj.sortOrder, created_at: obj.createdAt,
            updated_at: obj.updatedAt, deleted_at: obj.deletedAt ? new Date(obj.deletedAt) : null,
        };
    }
}

@Injectable() export class TestimonialMapper implements IMapper<Testimonial, PrismaTestimonial> {
    toDomain(raw: PrismaTestimonial): Testimonial {
        return Testimonial.create(raw.id, {
            clientName: raw.client_name, clientPosition: raw.client_position || undefined,
            clientCompany: raw.client_company || undefined, clientAvatar: raw.client_avatar || undefined,
            content: raw.content, rating: raw.rating || undefined, projectId: raw.project_id || undefined,
            featured: raw.featured, status: Status.fromString(raw.status), sortOrder: raw.sort_order,
            createdAt: raw.created_at, updatedAt: raw.updated_at, deletedAt: raw.deleted_at || undefined,
        });
    }
    toPersistence(domain: Testimonial): Partial<PrismaTestimonial> {
        const obj = domain.toObject();
        return {
            id: domain.id, client_name: obj.clientName, client_position: obj.clientPosition || null,
            client_company: obj.clientCompany || null, client_avatar: obj.clientAvatar || null,
            content: obj.content, rating: obj.rating || null, project_id: obj.projectId ? BigInt(obj.projectId) : null,
            featured: obj.featured, status: obj.status as any, sort_order: obj.sortOrder,
            created_at: obj.createdAt, updated_at: obj.updatedAt, deleted_at: obj.deletedAt ? new Date(obj.deletedAt) : null,
        };
    }
}
