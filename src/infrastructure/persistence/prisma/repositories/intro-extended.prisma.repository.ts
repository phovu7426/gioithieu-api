import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { IContactRepository, IAboutSectionRepository } from '@/domain/repositories/intro-extended.repository.interface';
import { Contact, AboutSection } from '@/domain/models/intro-extended.model';
import { ContactMapper, AboutSectionMapper } from '../mappers/intro-extended.mapper';

@Injectable()
export class ContactPrismaRepository implements IContactRepository {
    constructor(private readonly prisma: PrismaService, private readonly mapper: ContactMapper) { }
    async findById(id: bigint) { const raw = await this.prisma.contact.findFirst({ where: { id, deleted_at: null } }); return raw ? this.mapper.toDomain(raw) : null; }
    async findByEmail(email: string) { const list = await this.prisma.contact.findMany({ where: { email, deleted_at: null }, orderBy: { created_at: 'desc' } }); return list.map(r => this.mapper.toDomain(r)); }
    async findAll() { const list = await this.prisma.contact.findMany({ where: { deleted_at: null } }); return list.map(r => this.mapper.toDomain(r)); }
    async save(entity: Contact) { const data = this.mapper.toPersistence(entity); delete data.id; const raw = await this.prisma.contact.create({ data: data as any }); return this.mapper.toDomain(raw); }
    async update(entity: Contact) { const data = this.mapper.toPersistence(entity); delete data.id; const raw = await this.prisma.contact.update({ where: { id: entity.id }, data: data as any }); return this.mapper.toDomain(raw); }
    async delete(id: bigint) { try { await this.prisma.contact.update({ where: { id }, data: { deleted_at: new Date() } }); return true; } catch { return false; } }
    async exists(id: bigint) { return (await this.prisma.contact.count({ where: { id, deleted_at: null } })) > 0; }
}

@Injectable()
export class AboutSectionPrismaRepository implements IAboutSectionRepository {
    constructor(private readonly prisma: PrismaService, private readonly mapper: AboutSectionMapper) { }
    async findById(id: bigint) { const raw = await this.prisma.aboutSection.findFirst({ where: { id, deleted_at: null } }); return raw ? this.mapper.toDomain(raw) : null; }
    async findBySlug(slug: string) { const raw = await this.prisma.aboutSection.findFirst({ where: { slug, deleted_at: null } }); return raw ? this.mapper.toDomain(raw) : null; }
    async findByType(type: string) { const list = await this.prisma.aboutSection.findMany({ where: { section_type: type as any, deleted_at: null }, orderBy: { sort_order: 'asc' } }); return list.map(r => this.mapper.toDomain(r)); }
    async findActive() { const list = await this.prisma.aboutSection.findMany({ where: { status: 'active', deleted_at: null }, orderBy: { sort_order: 'asc' } }); return list.map(r => this.mapper.toDomain(r)); }
    async findAll() { const list = await this.prisma.aboutSection.findMany({ where: { deleted_at: null } }); return list.map(r => this.mapper.toDomain(r)); }
    async save(entity: AboutSection) { const data = this.mapper.toPersistence(entity); delete data.id; const raw = await this.prisma.aboutSection.create({ data: data as any }); return this.mapper.toDomain(raw); }
    async update(entity: AboutSection) { const data = this.mapper.toPersistence(entity); delete data.id; const raw = await this.prisma.aboutSection.update({ where: { id: entity.id }, data: data as any }); return this.mapper.toDomain(raw); }
    async delete(id: bigint) { try { await this.prisma.aboutSection.update({ where: { id }, data: { deleted_at: new Date() } }); return true; } catch { return false; } }
    async exists(id: bigint) { return (await this.prisma.aboutSection.count({ where: { id, deleted_at: null } })) > 0; }
}
