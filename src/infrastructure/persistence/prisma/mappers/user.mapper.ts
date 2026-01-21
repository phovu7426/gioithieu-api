import { Injectable } from '@nestjs/common';
import { User as PrismaUser } from '@prisma/client';
import { User } from '@/domain/models/user.model';
import { Email, Status } from '@/domain/value-objects';
import { IMapper } from '../../mapper.interface';

@Injectable()
export class UserMapper implements IMapper<User, PrismaUser> {
    toDomain(raw: PrismaUser): User {
        return User.create(raw.id, {
            username: raw.username || undefined,
            email: raw.email ? Email.create(raw.email) : undefined,
            phone: raw.phone || undefined,
            password: raw.password || undefined,
            name: raw.name || undefined,
            image: raw.image || undefined,
            googleId: raw.googleId || undefined,
            status: Status.fromString(raw.status),
            emailVerifiedAt: raw.email_verified_at || undefined,
            phoneVerifiedAt: raw.phone_verified_at || undefined,
            lastLoginAt: raw.last_login_at || undefined,
            createdAt: raw.created_at,
            updatedAt: raw.updated_at,
            deletedAt: raw.deleted_at || undefined,
        });
    }

    toPersistence(domain: User): Partial<PrismaUser> {
        const obj = domain.toObject();
        return {
            id: domain.id,
            username: obj.username || null,
            email: obj.email || null,
            phone: obj.phone || null,
            password: obj.password || null,
            name: obj.name || null,
            image: obj.image || null,
            googleId: obj.googleId || null,
            status: obj.status as any,
            email_verified_at: obj.emailVerifiedAt || null,
            phone_verified_at: obj.phoneVerifiedAt || null,
            last_login_at: obj.lastLoginAt || null,
            created_at: obj.createdAt,
            updated_at: obj.updatedAt,
            deleted_at: obj.deletedAt ? new Date(obj.deletedAt) : null,
        };
    }
}
