
import { Injectable } from '@nestjs/common';
import { User, Prisma, Profile } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { PrismaRepository } from '@/common/core/repositories';
import { IUserRepository, UserFilter } from './user.repository.interface';

@Injectable()
export class UserPrismaRepository extends PrismaRepository<
    User,
    Prisma.UserWhereInput,
    Prisma.UserCreateInput,
    Prisma.UserUpdateInput,
    Prisma.UserOrderByWithRelationInput
> implements IUserRepository {
    constructor(private readonly prisma: PrismaService) {
        super(prisma.user as unknown as any);
        this.isSoftDelete = true;
        this.defaultSelect = {
            id: true,
            email: true,
            phone: true,
            username: true,
            created_at: true,
            updated_at: true,
            last_login_at: true,
            status: true,
            profile: true,
            user_role_assignments: true,
        };
    }

    protected buildWhere(filter: UserFilter): Prisma.UserWhereInput {
        const where: Prisma.UserWhereInput = {};

        if (filter.search) {
            where.OR = [
                { email: { contains: filter.search } },
                { username: { contains: filter.search } },
                { phone: { contains: filter.search } },
            ];
        }

        if (filter.email) where.email = filter.email;
        if (filter.phone) where.phone = filter.phone;
        if (filter.username) where.username = filter.username;
        if (filter.status) where.status = filter.status as any;

        if (filter.groupId) {
            where.user_groups = {
                some: {
                    group_id: this.toPrimaryKey(filter.groupId),
                },
            };
        }

        if (filter.NOT) {
            where.NOT = filter.NOT;
        }

        return where;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.findOne({ email });
    }

    async findByPhone(phone: string): Promise<User | null> {
        return this.findOne({ phone });
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.findOne({ username });
    }

    async checkUnique(field: 'email' | 'phone' | 'username', value: string, excludeUserId?: number | bigint): Promise<boolean> {
        const filter: Record<string, any> = { [field]: value };
        if (excludeUserId) {
            filter.NOT = { id: this.toPrimaryKey(excludeUserId) };
        }
        return !(await this.exists(filter));
    }

    async upsertProfile(userId: number | bigint, data: Prisma.ProfileUncheckedCreateInput): Promise<Profile> {
        const pk = this.toPrimaryKey(userId);
        const profileData = { ...data, user_id: pk };

        return this.prisma.profile.upsert({
            where: { user_id: pk },
            create: profileData,
            update: profileData,
        });
    }

    async updateLastLogin(userId: number | bigint): Promise<void> {
        await this.update(userId, { last_login_at: new Date() });
    }

    async findByIdWithBasicInfo(userId: number | bigint) {
        return this.findFirstRaw({
            where: { id: this.toPrimaryKey(userId) },
            select: {
                id: true,
                username: true,
                email: true,
                phone: true,
                status: true,
                email_verified_at: true,
                phone_verified_at: true,
                last_login_at: true,
                created_at: true,
                updated_at: true,
            },
        });
    }
}
