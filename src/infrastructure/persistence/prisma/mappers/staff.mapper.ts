import { Injectable } from '@nestjs/common';
import { Staff as PrismaStaff } from '@prisma/client';
import { Staff } from '@/domain/models/staff.model';
import { Status } from '@/domain/value-objects/status.vo';
import { IMapper } from '../../mapper.interface';

@Injectable()
export class StaffMapper implements IMapper<Staff, PrismaStaff> {
    toDomain(raw: PrismaStaff): Staff {
        return Staff.create(raw.id, {
            name: raw.name,
            position: raw.position,
            department: raw.department || undefined,
            bio: raw.bio || undefined,
            avatar: raw.avatar || undefined,
            email: raw.email || undefined,
            phone: raw.phone || undefined,
            socialLinks: raw.social_links,
            experience: raw.experience || undefined,
            expertise: raw.expertise || undefined,
            status: Status.fromString(raw.status),
            sortOrder: raw.sort_order,
            createdAt: raw.created_at,
            updatedAt: raw.updated_at,
            deletedAt: raw.deleted_at || undefined,
        });
    }

    toPersistence(domain: Staff): Partial<PrismaStaff> {
        const obj = domain.toObject();
        return {
            id: domain.id,
            name: obj.name,
            position: obj.position,
            department: obj.department || null,
            bio: obj.bio || null,
            avatar: obj.avatar || null,
            email: obj.email || null,
            phone: obj.phone || null,
            social_links: obj.socialLinks || null,
            experience: obj.experience || null,
            expertise: obj.expertise || null,
            status: obj.status as any,
            sort_order: obj.sortOrder,
            created_at: obj.createdAt,
            updated_at: obj.updatedAt,
            deleted_at: obj.deletedAt ? new Date(obj.deletedAt) : null,
        };
    }
}
