
import { Injectable } from '@nestjs/common';
import { User, Prisma, Profile } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { PrismaRepository } from '@/common/base/repository/prisma.repository';
import { IUserRepository, UserFilter } from './user.repository.interface';
import { IPaginationOptions, IPaginatedResult } from '@/common/base/repository/repository.interface';
import { createPaginationMeta } from '@/common/base/utils/pagination.helper';

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
    }

    private get defaultSelect(): Prisma.UserSelect {
        return {
            id: true,
            email: true,
            phone: true,
            username: true,
            created_at: true,
            updated_at: true,
            last_login_at: true,
            status: true,
            // Include profile and roles by default as they are always needed in admin
            profile: true,
            user_role_assignments: true,
            // We might need user_groups to filter but usually not select all of them
        };
    }

    protected buildWhere(filter: UserFilter): Prisma.UserWhereInput {
        const where: Prisma.UserWhereInput = {};

        if (filter.search) {
            where.OR = [
                { email: { contains: filter.search } },
                { username: { contains: filter.search } },
                { phone: { contains: filter.search } },
                // Profile filtering disabled due to strict type checks on generated Prisma types
                // { profile: { first_name: { contains: filter.search } } },
                // { profile: { last_name: { contains: filter.search } } },
            ];
        }

        if (filter.email) where.email = filter.email;
        if (filter.phone) where.phone = filter.phone;
        if (filter.username) where.username = filter.username;
        if (filter.status) where.status = filter.status as any;

        if (filter.groupId) {
            where.user_groups = {
                some: {
                    group_id: BigInt(filter.groupId),
                },
            };
        }

        return where;
    }

    // Override findAll to use defaultSelect and relation handling
    async findAll(options: IPaginationOptions & { filter?: UserFilter } = {}): Promise<IPaginatedResult<User>> {
        const page = Math.max(Number(options.page) || 1, 1);
        const limit = Math.max(Number(options.limit) || 10, 1);
        const sort = options.sort || 'id:DESC';

        const where = this.buildWhere(options.filter || {});
        const orderBy = this.parseSort(sort);

        const [data, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                select: this.defaultSelect,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.user.count({ where }),
        ]);

        return {
            data: data as unknown as User[],
            meta: createPaginationMeta(page, limit, total),
        };
    }

    async findById(id: string | number | bigint): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { id: BigInt(id) },
            select: this.defaultSelect,
        });
        return user as unknown as User;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { email } }) as unknown as User;
    }

    async findByPhone(phone: string): Promise<User | null> {
        return this.prisma.user.findFirst({ where: { phone } }) as unknown as User;
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { username } }) as unknown as User;
    }

    async checkUnique(field: 'email' | 'phone' | 'username', value: string, excludeUserId?: number | bigint): Promise<boolean> {
        const where: Prisma.UserWhereInput = { [field]: value };
        if (excludeUserId) {
            where.NOT = { id: BigInt(excludeUserId) };
        }
        const count = await this.prisma.user.count({ where });
        return count === 0;
    }

    async upsertProfile(userId: number | bigint, data: Prisma.ProfileUncheckedCreateInput): Promise<Profile> {
        // Ensure user_id is set
        const profileData = { ...data, user_id: BigInt(userId) };

        return this.prisma.profile.upsert({
            where: { user_id: BigInt(userId) },
            create: profileData,
            update: profileData,
        });
    }

    async upsert(where: Prisma.UserWhereUniqueInput, create: Prisma.UserCreateInput, update: Prisma.UserUpdateInput): Promise<User> {
        return this.prisma.user.upsert({ where, create, update }) as unknown as User;
    }

    async updateLastLogin(userId: number | bigint): Promise<void> {
        await this.prisma.user.update({
            where: { id: BigInt(userId) },
            data: { last_login_at: new Date() },
        });
    }
}
