import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { IGalleryRepository, IPartnerRepository, IFaqRepository, ITestimonialRepository } from '@/domain/repositories/intro-group.repository.interface';
import { Gallery } from '@/domain/models/gallery.model';
import { Partner } from '@/domain/models/partner.model';
import { Faq } from '@/domain/models/faq.model';
import { Testimonial } from '@/domain/models/testimonial.model';
import { GalleryMapper, PartnerMapper, FaqMapper, TestimonialMapper } from '../mappers/intro-group.mapper';

@Injectable()
export class GalleryPrismaRepository implements IGalleryRepository {
    constructor(private readonly prisma: PrismaService, private readonly mapper: GalleryMapper) { }
    async findById(id: bigint) { const raw = await this.prisma.gallery.findFirst({ where: { id, deleted_at: null } }); return raw ? this.mapper.toDomain(raw) : null; }
    async findBySlug(slug: string) { const raw = await this.prisma.gallery.findFirst({ where: { slug, deleted_at: null } }); return raw ? this.mapper.toDomain(raw) : null; }
    async findAll() { const list = await this.prisma.gallery.findMany({ where: { deleted_at: null }, orderBy: { sort_order: 'asc' } }); return list.map(r => this.mapper.toDomain(r)); }
    async findActive() { const list = await this.prisma.gallery.findMany({ where: { status: 'active', deleted_at: null }, orderBy: { sort_order: 'asc' } }); return list.map(r => this.mapper.toDomain(r)); }
    async save(entity: Gallery) { const data = this.mapper.toPersistence(entity); delete data.id; const raw = await this.prisma.gallery.create({ data: data as any }); return this.mapper.toDomain(raw); }
    async update(entity: Gallery) { const data = this.mapper.toPersistence(entity); delete data.id; const raw = await this.prisma.gallery.update({ where: { id: entity.id }, data: data as any }); return this.mapper.toDomain(raw); }
    async delete(id: bigint) { try { await this.prisma.gallery.update({ where: { id }, data: { deleted_at: new Date() } }); return true; } catch { return false; } }
    async exists(id: bigint) { return (await this.prisma.gallery.count({ where: { id, deleted_at: null } })) > 0; }
}

@Injectable()
export class PartnerPrismaRepository implements IPartnerRepository {
    constructor(private readonly prisma: PrismaService, private readonly mapper: PartnerMapper) { }
    async findById(id: bigint) { const raw = await this.prisma.partner.findFirst({ where: { id, deleted_at: null } }); return raw ? this.mapper.toDomain(raw) : null; }
    async findAll() { const list = await this.prisma.partner.findMany({ where: { deleted_at: null }, orderBy: { sort_order: 'asc' } }); return list.map(r => this.mapper.toDomain(r)); }
    async findActive() { const list = await this.prisma.partner.findMany({ where: { status: 'active', deleted_at: null }, orderBy: { sort_order: 'asc' } }); return list.map(r => this.mapper.toDomain(r)); }
    async findByType(type: string) { const list = await this.prisma.partner.findMany({ where: { type: type as any, deleted_at: null }, orderBy: { sort_order: 'asc' } }); return list.map(r => this.mapper.toDomain(r)); }
    async save(entity: Partner) { const data = this.mapper.toPersistence(entity); delete data.id; const raw = await this.prisma.partner.create({ data: data as any }); return this.mapper.toDomain(raw); }
    async update(entity: Partner) { const data = this.mapper.toPersistence(entity); delete data.id; const raw = await this.prisma.partner.update({ where: { id: entity.id }, data: data as any }); return this.mapper.toDomain(raw); }
    async delete(id: bigint) { try { await this.prisma.partner.update({ where: { id }, data: { deleted_at: new Date() } }); return true; } catch { return false; } }
    async exists(id: bigint) { return (await this.prisma.partner.count({ where: { id, deleted_at: null } })) > 0; }
}

@Injectable()
export class FaqPrismaRepository implements IFaqRepository {
    constructor(private readonly prisma: PrismaService, private readonly mapper: FaqMapper) { }
    async findById(id: bigint) { const raw = await this.prisma.faq.findFirst({ where: { id, deleted_at: null } }); return raw ? this.mapper.toDomain(raw) : null; }
    async findAll() { const list = await this.prisma.faq.findMany({ where: { deleted_at: null }, orderBy: { sort_order: 'asc' } }); return list.map(r => this.mapper.toDomain(r)); }
    async findActive() { const list = await this.prisma.faq.findMany({ where: { status: 'active', deleted_at: null }, orderBy: { sort_order: 'asc' } }); return list.map(r => this.mapper.toDomain(r)); }
    async save(entity: Faq) { const data = this.mapper.toPersistence(entity); delete data.id; const raw = await this.prisma.faq.create({ data: data as any }); return this.mapper.toDomain(raw); }
    async update(entity: Faq) { const data = this.mapper.toPersistence(entity); delete data.id; const raw = await this.prisma.faq.update({ where: { id: entity.id }, data: data as any }); return this.mapper.toDomain(raw); }
    async delete(id: bigint) { try { await this.prisma.faq.update({ where: { id }, data: { deleted_at: new Date() } }); return true; } catch { return false; } }
    async exists(id: bigint) { return (await this.prisma.faq.count({ where: { id, deleted_at: null } })) > 0; }
}

@Injectable()
export class TestimonialPrismaRepository implements ITestimonialRepository {
    constructor(private readonly prisma: PrismaService, private readonly mapper: TestimonialMapper) { }
    async findById(id: bigint) { const raw = await this.prisma.testimonial.findFirst({ where: { id, deleted_at: null } }); return raw ? this.mapper.toDomain(raw) : null; }
    async findAll() { const list = await this.prisma.testimonial.findMany({ where: { deleted_at: null }, orderBy: { sort_order: 'asc' } }); return list.map(r => this.mapper.toDomain(r)); }
    async findActive() { const list = await this.prisma.testimonial.findMany({ where: { status: 'active', deleted_at: null }, orderBy: { sort_order: 'asc' } }); return list.map(r => this.mapper.toDomain(r)); }
    async findFeatured(limit: number) { const list = await this.prisma.testimonial.findMany({ where: { featured: true, status: 'active', deleted_at: null }, orderBy: { sort_order: 'asc' }, take: limit }); return list.map(r => this.mapper.toDomain(r)); }
    async findByProject(projectId: bigint) { const list = await this.prisma.testimonial.findMany({ where: { project_id: projectId, deleted_at: null }, orderBy: { sort_order: 'asc' } }); return list.map(r => this.mapper.toDomain(r)); }
    async save(entity: Testimonial) { const data = this.mapper.toPersistence(entity); delete data.id; const raw = await this.prisma.testimonial.create({ data: data as any }); return this.mapper.toDomain(raw); }
    async update(entity: Testimonial) { const data = this.mapper.toPersistence(entity); delete data.id; const raw = await this.prisma.testimonial.update({ where: { id: entity.id }, data: data as any }); return this.mapper.toDomain(raw); }
    async delete(id: bigint) { try { await this.prisma.testimonial.update({ where: { id }, data: { deleted_at: new Date() } }); return true; } catch { return false; } }
    async exists(id: bigint) { return (await this.prisma.testimonial.count({ where: { id, deleted_at: null } })) > 0; }
}
