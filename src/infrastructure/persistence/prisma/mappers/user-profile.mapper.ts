import { Injectable } from '@nestjs/common';
import { Profile as PrismaProfile } from '@prisma/client';
import { Profile } from '@/domain/models/user-profile.model';
import { IMapper } from '../../mapper.interface';

@Injectable()
export class UserProfileMapper implements IMapper<Profile, PrismaProfile> {
    toDomain(raw: PrismaProfile): Profile {
        return Profile.create(raw.id, {
            userId: raw.user_id,
            birthday: raw.birthday || undefined,
            gender: raw.gender || undefined,
            address: raw.address || undefined,
            about: raw.about || undefined,
            createdAt: raw.created_at,
            updatedAt: raw.updated_at
        });
    }
    toPersistence(domain: Profile): Partial<PrismaProfile> {
        const obj = domain.toObject();
        return {
            id: domain.id,
            user_id: BigInt(obj.userId),
            birthday: obj.birthday ? new Date(obj.birthday) : null,
            gender: obj.gender as any,
            address: obj.address || null,
            about: obj.about || null,
            created_at: obj.createdAt,
            updated_at: obj.updatedAt
        };
    }
}
