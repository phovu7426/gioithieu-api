import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import {
    IRoleRepository, IPermissionRepository, IGeneralConfigRepository,
    IEmailConfigRepository, IMenuRepository
} from '@/domain/repositories/core-system.repository.interface';
import { Role, Permission, GeneralConfig, EmailConfig, Menu } from '@/domain/models';
import { RoleMapper, PermissionMapper } from '../mappers/rbac.mapper';
import { SystemMapper, EmailConfigMapper, MenuMapper } from '../mappers/system.mapper';

@Injectable()
export class RolePrismaRepository implements IRoleRepository {
    constructor(private readonly prisma: PrismaService, private readonly mapper: RoleMapper) { }
    async findById(id: bigint) { const raw = await this.prisma.role.findFirst({ where: { id, deleted_at: null } }); return raw ? this.mapper.toDomain(raw) : null; }
    async findByCode(code: string) { const raw = await this.prisma.role.findFirst({ where: { code, deleted_at: null } }); return raw ? this.mapper.toDomain(raw) : null; }
    async findAll() { const list = await this.prisma.role.findMany({ where: { deleted_at: null } }); return list.map(r => this.mapper.toDomain(r)); }
    async save(entity: Role) { const data = this.mapper.toPersistence(entity); delete data.id; const raw = await this.prisma.role.create({ data: data as any }); return this.mapper.toDomain(raw); }
    async update(entity: Role) { const data = this.mapper.toPersistence(entity); delete data.id; const raw = await this.prisma.role.update({ where: { id: entity.id }, data: data as any }); return this.mapper.toDomain(raw); }
    async delete(id: bigint) { try { await this.prisma.role.update({ where: { id }, data: { deleted_at: new Date() } }); return true; } catch { return false; } }
    async exists(id: bigint) { return (await this.prisma.role.count({ where: { id, deleted_at: null } })) > 0; }
}

@Injectable()
export class PermissionPrismaRepository implements IPermissionRepository {
    constructor(private readonly prisma: PrismaService, private readonly mapper: PermissionMapper) { }
    async findById(id: bigint) { const raw = await this.prisma.permission.findFirst({ where: { id, deleted_at: null } }); return raw ? this.mapper.toDomain(raw) : null; }
    async findByCode(code: string) { const raw = await this.prisma.permission.findFirst({ where: { code, deleted_at: null } }); return raw ? this.mapper.toDomain(raw) : null; }
    async findAll() { const list = await this.prisma.permission.findMany({ where: { deleted_at: null } }); return list.map(r => this.mapper.toDomain(r)); }
    async save(entity: Permission) { const data = this.mapper.toPersistence(entity); delete data.id; const raw = await this.prisma.permission.create({ data: data as any }); return this.mapper.toDomain(raw); }
    async update(entity: Permission) { const data = this.mapper.toPersistence(entity); delete data.id; const raw = await this.prisma.permission.update({ where: { id: entity.id }, data: data as any }); return this.mapper.toDomain(raw); }
    async delete(id: bigint) { try { await this.prisma.permission.update({ where: { id }, data: { deleted_at: new Date() } }); return true; } catch { return false; } }
    async exists(id: bigint) { return (await this.prisma.permission.count({ where: { id, deleted_at: null } })) > 0; }
}

@Injectable()
export class GeneralConfigPrismaRepository implements IGeneralConfigRepository {
    constructor(private readonly prisma: PrismaService, private readonly mapper: SystemMapper) { }
    async getLatest() { const raw = await this.prisma.generalConfig.findFirst({ orderBy: { created_at: 'desc' } }); return raw ? this.mapper.toDomain(raw) : null; }
    async findById(id: bigint) { const raw = await this.prisma.generalConfig.findUnique({ where: { id } }); return raw ? this.mapper.toDomain(raw) : null; }
    async findAll() { const list = await this.prisma.generalConfig.findMany(); return list.map(r => this.mapper.toDomain(r)); }
    async save(entity: GeneralConfig) { const data = this.mapper.toPersistence(entity); delete data.id; const raw = await this.prisma.generalConfig.create({ data: data as any }); return this.mapper.toDomain(raw); }
    async update(entity: GeneralConfig) { const data = this.mapper.toPersistence(entity); delete data.id; const raw = await this.prisma.generalConfig.update({ where: { id: entity.id }, data: data as any }); return this.mapper.toDomain(raw); }
    async delete(id: bigint) { try { await this.prisma.generalConfig.delete({ where: { id } }); return true; } catch { return false; } }
    async exists(id: bigint) { return (await this.prisma.generalConfig.count({ where: { id } })) > 0; }
}

@Injectable()
export class EmailConfigPrismaRepository implements IEmailConfigRepository {
    constructor(private readonly prisma: PrismaService, private readonly mapper: EmailConfigMapper) { }
    async getLatest() { const raw = await this.prisma.emailConfig.findFirst({ orderBy: { created_at: 'desc' } }); return raw ? this.mapper.toDomain(raw) : null; }
    async findById(id: bigint) { return null; } // Not often used
    async findAll() { return []; }
    async save(entity: EmailConfig) { const data = this.mapper.toPersistence(entity); const raw = await this.prisma.emailConfig.create({ data: data as any }); return this.mapper.toDomain(raw); }
    async update(entity: EmailConfig) { const data = this.mapper.toPersistence(entity); const raw = await this.prisma.emailConfig.update({ where: { id: entity.id }, data: data as any }); return this.mapper.toDomain(raw); }
    async delete(id: bigint) { await this.prisma.emailConfig.delete({ where: { id } }); return true; }
    async exists(id: bigint) { return true; }
}

@Injectable()
export class MenuPrismaRepository implements IMenuRepository {
    constructor(private readonly prisma: PrismaService, private readonly mapper: MenuMapper) { }
    async findById(id: bigint) { const raw = await this.prisma.menu.findUnique({ where: { id } }); return raw ? this.mapper.toDomain(raw) : null; }
    async findByCode(code: string) { const raw = await this.prisma.menu.findUnique({ where: { code } }); return raw ? this.mapper.toDomain(raw) : null; }
    async findTree() { const list = await this.prisma.menu.findMany({ where: { deleted_at: null }, orderBy: { sort_order: 'asc' } }); return list.map(r => this.mapper.toDomain(r)); }
    async findAll() { return this.findTree(); }
    async save(entity: Menu) { const data = this.mapper.toPersistence(entity); const raw = await this.prisma.menu.create({ data: data as any }); return this.mapper.toDomain(raw); }
    async update(entity: Menu) { const data = this.mapper.toPersistence(entity); const raw = await this.prisma.menu.update({ where: { id: entity.id }, data: data as any }); return this.mapper.toDomain(raw); }
    async delete(id: bigint) { await this.prisma.menu.update({ where: { id }, data: { deleted_at: new Date() } }); return true; }
    async exists(id: bigint) { return true; }
}
