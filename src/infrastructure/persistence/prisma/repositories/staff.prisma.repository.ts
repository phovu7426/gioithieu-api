import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { IStaffRepository } from '@/domain/repositories/staff.repository.interface';
import { Staff } from '@/domain/models/staff.model';
import { StaffMapper } from '../mappers/staff.mapper';

@Injectable()
export class StaffPrismaRepository implements IStaffRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mapper: StaffMapper,
    ) { }

    async findById(id: bigint): Promise<Staff | null> {
        const raw = await this.prisma.staff.findFirst({
            where: { id, deleted_at: null },
        });
        return raw ? this.mapper.toDomain(raw) : null;
    }

    async findAll(): Promise<Staff[]> {
        const rawList = await this.prisma.staff.findMany({
            where: { deleted_at: null },
            orderBy: { sort_order: 'asc' },
        });
        return rawList.map(raw => this.mapper.toDomain(raw));
    }

    async findActive(): Promise<Staff[]> {
        const rawList = await this.prisma.staff.findMany({
            where: { status: 'active', deleted_at: null },
            orderBy: { sort_order: 'asc' },
        });
        return rawList.map(raw => this.mapper.toDomain(raw));
    }

    async findByDepartment(department: string): Promise<Staff[]> {
        const rawList = await this.prisma.staff.findMany({
            where: { department, deleted_at: null },
            orderBy: { sort_order: 'asc' },
        });
        return rawList.map(raw => this.mapper.toDomain(raw));
    }

    async save(entity: Staff): Promise<Staff> {
        const data = this.mapper.toPersistence(entity);
        delete data.id;
        delete data.created_at;
        delete data.updated_at;
        delete data.deleted_at;
        const raw = await this.prisma.staff.create({ data: data as any });
        return this.mapper.toDomain(raw);
    }

    async update(entity: Staff): Promise<Staff> {
        const data = this.mapper.toPersistence(entity);
        delete data.id;
        delete data.created_at;
        const raw = await this.prisma.staff.update({
            where: { id: entity.id },
            data: data as any,
        });
        return this.mapper.toDomain(raw);
    }

    async delete(id: bigint): Promise<boolean> {
        try {
            await this.prisma.staff.update({
                where: { id },
                data: { deleted_at: new Date() },
            });
            return true;
        } catch {
            return false;
        }
    }

    async exists(id: bigint): Promise<boolean> {
        const count = await this.prisma.staff.count({
            where: { id, deleted_at: null },
        });
        return count > 0;
    }
}
