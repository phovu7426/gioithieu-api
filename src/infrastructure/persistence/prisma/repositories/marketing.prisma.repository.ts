import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { IBannerRepository, IBannerLocationRepository } from '@/domain/repositories/marketing.repository.interface';
import { Banner, BannerLocation } from '@/domain/models/banner.model';
import { BannerMapper, BannerLocationMapper } from '../mappers/marketing.mapper';

@Injectable()
export class BannerLocationPrismaRepository implements IBannerLocationRepository {
    constructor(private readonly prisma: PrismaService, private readonly mapper: BannerLocationMapper) { }
    async findById(id: bigint) { const raw = await this.prisma.bannerLocation.findFirst({ where: { id, deleted_at: null } }); return raw ? this.mapper.toDomain(raw) : null; }
    async findByCode(code: string) { const raw = await this.prisma.bannerLocation.findFirst({ where: { code, deleted_at: null } }); return raw ? this.mapper.toDomain(raw) : null; }
    async findAll() { const list = await this.prisma.bannerLocation.findMany({ where: { deleted_at: null }, orderBy: { id: 'desc' } }); return list.map(r => this.mapper.toDomain(r)); }
    async save(entity: BannerLocation) { const data = this.mapper.toPersistence(entity); delete data.id; const raw = await this.prisma.bannerLocation.create({ data: data as any }); return this.mapper.toDomain(raw); }
    async update(entity: BannerLocation) { const data = this.mapper.toPersistence(entity); delete data.id; const raw = await this.prisma.bannerLocation.update({ where: { id: entity.id }, data: data as any }); return this.mapper.toDomain(raw); }
    async delete(id: bigint) { try { await this.prisma.bannerLocation.update({ where: { id }, data: { deleted_at: new Date() } }); return true; } catch { return false; } }
    async exists(id: bigint) { return (await this.prisma.bannerLocation.count({ where: { id, deleted_at: null } })) > 0; }
}

@Injectable()
export class BannerPrismaRepository implements IBannerRepository {
    constructor(private readonly prisma: PrismaService, private readonly mapper: BannerMapper) { }
    async findById(id: bigint) { const raw = await this.prisma.banner.findFirst({ where: { id, deleted_at: null } }); return raw ? this.mapper.toDomain(raw) : null; }
    async findByLocation(locationId: bigint) { const list = await this.prisma.banner.findMany({ where: { location_id: locationId, deleted_at: null }, orderBy: { sort_order: 'asc' } }); return list.map(r => this.mapper.toDomain(r)); }
    async findActiveByLocation(locationCode: string) {
        const list = await this.prisma.banner.findMany({
            where: {
                location: { code: locationCode },
                status: 'active',
                deleted_at: null,
                OR: [
                    { start_date: null },
                    { start_date: { lte: new Date() } }
                ],
                AND: [
                    { OR: [{ end_date: null }, { end_date: { gte: new Date() } }] }
                ]
            },
            orderBy: { sort_order: 'asc' }
        });
        return list.map(r => this.mapper.toDomain(r));
    }
    async findAll() { const list = await this.prisma.banner.findMany({ where: { deleted_at: null }, orderBy: { sort_order: 'asc' } }); return list.map(r => this.mapper.toDomain(r)); }
    async save(entity: Banner) { const data = this.mapper.toPersistence(entity); delete data.id; const raw = await this.prisma.banner.create({ data: data as any }); return this.mapper.toDomain(raw); }
    async update(entity: Banner) { const data = this.mapper.toPersistence(entity); delete data.id; const raw = await this.prisma.banner.update({ where: { id: entity.id }, data: data as any }); return this.mapper.toDomain(raw); }
    async delete(id: bigint) { try { await this.prisma.banner.update({ where: { id }, data: { deleted_at: new Date() } }); return true; } catch { return false; } }
    async exists(id: bigint) { return (await this.prisma.banner.count({ where: { id, deleted_at: null } })) > 0; }
}
