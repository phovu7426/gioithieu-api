import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { User } from '@/domain/models/user.model';
import { UserMapper } from '../mappers/user.mapper';
import { Email } from '@/domain/value-objects';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mapper: UserMapper,
    ) { }

    async findById(id: bigint): Promise<User | null> {
        const raw = await this.prisma.user.findFirst({
            where: { id, deleted_at: null },
        });
        return raw ? this.mapper.toDomain(raw) : null;
    }

    async findByEmail(email: Email): Promise<User | null> {
        const raw = await this.prisma.user.findFirst({
            where: { email: email.value, deleted_at: null },
        });
        return raw ? this.mapper.toDomain(raw) : null;
    }

    async existsByEmail(email: Email): Promise<boolean> {
        const count = await this.prisma.user.count({
            where: { email: email.value, deleted_at: null },
        });
        return count > 0;
    }

    async findAll(): Promise<User[]> {
        const rawList = await this.prisma.user.findMany({
            where: { deleted_at: null },
        });
        return rawList.map(raw => this.mapper.toDomain(raw));
    }

    async save(entity: User): Promise<User> {
        const data = this.mapper.toPersistence(entity);
        delete data.id;
        delete data.created_at;
        delete data.updated_at;
        delete data.deleted_at;
        const raw = await this.prisma.user.create({ data: data as any });
        return this.mapper.toDomain(raw);
    }

    async update(entity: User): Promise<User> {
        const data = this.mapper.toPersistence(entity);
        delete data.id;
        delete data.created_at;
        const raw = await this.prisma.user.update({
            where: { id: entity.id },
            data: data as any,
        });
        return this.mapper.toDomain(raw);
    }

    async delete(id: bigint): Promise<boolean> {
        try {
            await this.prisma.user.update({
                where: { id },
                data: { deleted_at: new Date() },
            });
            return true;
        } catch {
            return false;
        }
    }

    async exists(id: bigint): Promise<boolean> {
        const count = await this.prisma.user.count({
            where: { id, deleted_at: null },
        });
        return count > 0;
    }
}
