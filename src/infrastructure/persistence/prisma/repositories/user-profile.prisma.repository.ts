import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { IProfileRepository } from '@/domain/repositories/user-profile.repository.interface';
import { Profile } from '@/domain/models/user-profile.model';
import { UserProfileMapper } from '../mappers/user-profile.mapper';

@Injectable()
export class UserProfilePrismaRepository implements IProfileRepository {
    constructor(private readonly prisma: PrismaService, private readonly mapper: UserProfileMapper) { }
    async findById(id: bigint) { const raw = await this.prisma.profile.findUnique({ where: { id } }); return raw ? this.mapper.toDomain(raw) : null; }
    async findByUserId(userId: bigint) { const raw = await this.prisma.profile.findUnique({ where: { user_id: userId } }); return raw ? this.mapper.toDomain(raw) : null; }
    async findAll() { const list = await this.prisma.profile.findMany(); return list.map(r => this.mapper.toDomain(r)); }
    async save(entity: Profile) { const data = this.mapper.toPersistence(entity); delete data.id; const raw = await this.prisma.profile.create({ data: data as any }); return this.mapper.toDomain(raw); }
    async update(entity: Profile) { const data = this.mapper.toPersistence(entity); delete data.id; const raw = await this.prisma.profile.update({ where: { id: entity.id }, data: data as any }); return this.mapper.toDomain(raw); }
    async delete(id: bigint) { try { await this.prisma.profile.delete({ where: { id } }); return true; } catch { return false; } }
    async exists(id: bigint) { return (await this.prisma.profile.count({ where: { id } })) > 0; }
}
