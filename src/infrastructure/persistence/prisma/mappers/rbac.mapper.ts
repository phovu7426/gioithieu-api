import { Injectable } from '@nestjs/common';
import { Role as PrismaRole, Permission as PrismaPermission, Context as PrismaContext } from '@prisma/client';
import { Role, Permission, Context } from '@/domain/models/rbac.model';
import { IMapper } from '../../mapper.interface';

@Injectable()
export class RoleMapper implements IMapper<Role, PrismaRole> {
    toDomain(raw: PrismaRole): Role {
        return Role.create(raw.id, {
            code: raw.code, name: raw.name || undefined, status: raw.status,
            parentId: raw.parent_id || undefined, createdAt: raw.created_at,
            updatedAt: raw.updated_at, deletedAt: raw.deleted_at || undefined
        });
    }
    toPersistence(domain: Role): Partial<PrismaRole> {
        const obj = domain.toObject();
        return {
            id: domain.id, code: obj.code, name: obj.name || null, status: obj.status,
            parent_id: obj.parentId ? BigInt(obj.parentId) : null,
            created_at: obj.createdAt, updated_at: obj.updatedAt,
            deleted_at: obj.deletedAt ? new Date(obj.deletedAt) : null
        };
    }
}

@Injectable()
export class PermissionMapper implements IMapper<Permission, PrismaPermission> {
    toDomain(raw: PrismaPermission): Permission {
        return Permission.create(raw.id, {
            code: raw.code, scope: raw.scope, name: raw.name || undefined, status: raw.status,
            parentId: raw.parent_id || undefined, createdAt: raw.created_at,
            updatedAt: raw.updated_at, deletedAt: raw.deleted_at || undefined
        });
    }
    toPersistence(domain: Permission): Partial<PrismaPermission> {
        const obj = domain.toObject();
        return {
            id: domain.id, code: obj.code, scope: obj.scope, name: obj.name || null, status: obj.status,
            parent_id: obj.parentId ? BigInt(obj.parentId) : null,
            created_at: obj.createdAt, updated_at: obj.updatedAt,
            deleted_at: obj.deletedAt ? new Date(obj.deletedAt) : null
        };
    }
}

@Injectable()
export class ContextMapper implements IMapper<Context, PrismaContext> {
    toDomain(raw: PrismaContext): Context {
        return Context.create(raw.id, {
            code: raw.code, name: raw.name, type: raw.type, status: raw.status,
            refId: raw.ref_id || undefined, createdAt: raw.created_at,
            updatedAt: raw.updated_at, deletedAt: raw.deleted_at || undefined
        });
    }
    toPersistence(domain: Context): Partial<PrismaContext> {
        const obj = domain.toObject();
        return {
            id: domain.id, code: obj.code, name: obj.name, type: obj.type, status: obj.status,
            ref_id: obj.refId ? BigInt(obj.refId) : null,
            created_at: obj.createdAt, updated_at: obj.updatedAt,
            deleted_at: obj.deletedAt ? new Date(obj.deletedAt) : null
        };
    }
}
