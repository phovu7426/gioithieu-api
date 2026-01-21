import { Injectable } from '@nestjs/common';
import { Certificate as PrismaCertificate } from '@prisma/client';
import { Certificate } from '@/domain/models/certificate.model';
import { Status } from '@/domain/value-objects';
import { IMapper } from '../../mapper.interface';

/**
 * Certificate Mapper
 * Converts between Prisma entities and Domain models
 */
@Injectable()
export class CertificateMapper implements IMapper<Certificate, PrismaCertificate> {
    /**
     * Convert Prisma entity to Domain model
     */
    toDomain(raw: PrismaCertificate): Certificate {
        return Certificate.create(raw.id, {
            name: raw.name,
            image: raw.image,
            issuedBy: raw.issued_by || undefined,
            issuedDate: raw.issued_date || undefined,
            expiryDate: raw.expiry_date || undefined,
            certificateNumber: raw.certificate_number || undefined,
            description: raw.description || undefined,
            type: raw.type,
            status: Status.fromString(raw.status),
            sortOrder: raw.sort_order,
            createdAt: raw.created_at,
            updatedAt: raw.updated_at,
            deletedAt: raw.deleted_at || undefined,
        });
    }

    /**
     * Convert Domain model to Prisma entity (for updates)
     */
    toPersistence(domain: Certificate): Partial<PrismaCertificate> {
        return {
            id: domain.id,
            name: domain.name,
            image: domain.image,
            issued_by: domain.issuedBy || null,
            issued_date: domain.issuedDate || null,
            expiry_date: domain.expiryDate || null,
            certificate_number: domain.certificateNumber || null,
            description: domain.description || null,
            type: domain.type as any,
            status: domain.status.value as any,
            sort_order: domain.sortOrder,
            created_at: domain.createdAt,
            updated_at: domain.updatedAt,
            deleted_at: domain.deletedAt || null,
        };
    }

    /**
     * Convert Domain model to Prisma create input
     */
    toCreateInput(data: {
        name: string;
        image: string;
        issuedBy?: string;
        issuedDate?: Date;
        expiryDate?: Date;
        certificateNumber?: string;
        description?: string;
        type: string;
        status?: string;
        sortOrder?: number;
    }): any {
        return {
            name: data.name,
            image: data.image,
            issued_by: data.issuedBy || null,
            issued_date: data.issuedDate || null,
            expiry_date: data.expiryDate || null,
            certificate_number: data.certificateNumber || null,
            description: data.description || null,
            type: data.type,
            status: data.status || 'active',
            sort_order: data.sortOrder || 0,
        };
    }

    /**
     * Convert Domain model to Prisma update input
     */
    toUpdateInput(data: Partial<{
        name: string;
        image: string;
        issuedBy: string;
        issuedDate: Date;
        expiryDate: Date;
        certificateNumber: string;
        description: string;
        type: string;
        status: string;
        sortOrder: number;
        deletedAt: Date;
    }>): any {
        const updateData: any = {};

        if (data.name !== undefined) updateData.name = data.name;
        if (data.image !== undefined) updateData.image = data.image;
        if (data.issuedBy !== undefined) updateData.issued_by = data.issuedBy || null;
        if (data.issuedDate !== undefined) updateData.issued_date = data.issuedDate || null;
        if (data.expiryDate !== undefined) updateData.expiry_date = data.expiryDate || null;
        if (data.certificateNumber !== undefined) updateData.certificate_number = data.certificateNumber || null;
        if (data.description !== undefined) updateData.description = data.description || null;
        if (data.type !== undefined) updateData.type = data.type;
        if (data.status !== undefined) updateData.status = data.status;
        if (data.sortOrder !== undefined) updateData.sort_order = data.sortOrder;
        if (data.deletedAt !== undefined) updateData.deleted_at = data.deletedAt || null;

        updateData.updated_at = new Date();

        return updateData;
    }
}
