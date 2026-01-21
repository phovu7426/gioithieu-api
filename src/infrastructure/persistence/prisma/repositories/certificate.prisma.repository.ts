import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { ICertificateRepository } from '@/domain/repositories/certificate.repository.interface';
import { Certificate } from '@/domain/models/certificate.model';
import { CertificateMapper } from '../mappers/certificate.mapper';

/**
 * Certificate Prisma Repository Implementation
 * Implements the repository interface using Prisma ORM
 */
@Injectable()
export class CertificatePrismaRepository implements ICertificateRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mapper: CertificateMapper,
    ) { }

    async findById(id: bigint): Promise<Certificate | null> {
        const raw = await this.prisma.certificate.findFirst({
            where: { id, deleted_at: null },
        });
        return raw ? this.mapper.toDomain(raw) : null;
    }

    async findAll(): Promise<Certificate[]> {
        const rawList = await this.prisma.certificate.findMany({
            where: { deleted_at: null },
            orderBy: { sort_order: 'asc' },
        });
        return rawList.map((raw) => this.mapper.toDomain(raw));
    }

    async findActive(): Promise<Certificate[]> {
        const rawList = await this.prisma.certificate.findMany({
            where: {
                status: 'active',
                deleted_at: null,
            },
            orderBy: { sort_order: 'asc' },
        });
        return rawList.map((raw) => this.mapper.toDomain(raw));
    }

    async findByStatus(status: string): Promise<Certificate[]> {
        const rawList = await this.prisma.certificate.findMany({
            where: {
                status: status as any,
                deleted_at: null,
            },
            orderBy: { sort_order: 'asc' },
        });
        return rawList.map((raw) => this.mapper.toDomain(raw));
    }

    async findByType(type: string): Promise<Certificate[]> {
        const rawList = await this.prisma.certificate.findMany({
            where: {
                type: type as any,
                deleted_at: null,
            },
            orderBy: { sort_order: 'asc' },
        });
        return rawList.map((raw) => this.mapper.toDomain(raw));
    }

    async findWithPagination(options: {
        page: number;
        limit: number;
        status?: string;
        type?: string;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        items: Certificate[];
        total: number;
        page: number;
        limit: number;
        lastPage: number;
    }> {
        const { page, limit, status, type, search, sortBy = 'sort_order', sortOrder = 'asc' } = options;
        const skip = (page - 1) * limit;

        const where: any = { deleted_at: null };

        if (status) {
            where.status = status;
        }

        if (type) {
            where.type = type;
        }

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } },
                { issued_by: { contains: search } },
                { certificate_number: { contains: search } },
            ];
        }

        const [rawList, total] = await Promise.all([
            this.prisma.certificate.findMany({
                where,
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: limit,
            }),
            this.prisma.certificate.count({ where }),
        ]);

        const items = rawList.map((raw) => this.mapper.toDomain(raw));
        const lastPage = Math.ceil(total / limit);

        return {
            items,
            total,
            page,
            limit,
            lastPage,
        };
    }

    async save(entity: Certificate): Promise<Certificate> {
        const data = this.mapper.toCreateInput({
            name: entity.name,
            image: entity.image,
            issuedBy: entity.issuedBy,
            issuedDate: entity.issuedDate,
            expiryDate: entity.expiryDate,
            certificateNumber: entity.certificateNumber,
            description: entity.description,
            type: entity.type,
            status: entity.status.value,
            sortOrder: entity.sortOrder,
        });

        const raw = await this.prisma.certificate.create({ data });
        return this.mapper.toDomain(raw);
    }

    async update(entity: Certificate): Promise<Certificate> {
        const data = this.mapper.toUpdateInput({
            name: entity.name,
            image: entity.image,
            issuedBy: entity.issuedBy,
            issuedDate: entity.issuedDate,
            expiryDate: entity.expiryDate,
            certificateNumber: entity.certificateNumber,
            description: entity.description,
            type: entity.type,
            status: entity.status.value,
            sortOrder: entity.sortOrder,
            deletedAt: entity.deletedAt,
        });

        const raw = await this.prisma.certificate.update({
            where: { id: entity.id },
            data,
        });

        return this.mapper.toDomain(raw);
    }

    async delete(id: bigint): Promise<boolean> {
        try {
            await this.prisma.certificate.update({
                where: { id },
                data: { deleted_at: new Date() },
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async exists(id: bigint): Promise<boolean> {
        const count = await this.prisma.certificate.count({
            where: { id, deleted_at: null },
        });
        return count > 0;
    }

    async existsByCertificateNumber(certificateNumber: string, excludeId?: bigint): Promise<boolean> {
        const where: any = {
            certificate_number: certificateNumber,
            deleted_at: null,
        };

        if (excludeId) {
            where.id = { not: excludeId };
        }

        const count = await this.prisma.certificate.count({ where });
        return count > 0;
    }
}
