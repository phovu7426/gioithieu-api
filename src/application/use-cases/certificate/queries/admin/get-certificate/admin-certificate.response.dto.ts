import { Certificate } from '@/domain/models/certificate.model';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Admin Certificate Response DTO
 * Contains full certificate information for admin users
 */
export class AdminCertificateResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    image: string;

    @ApiPropertyOptional()
    issuedBy?: string;

    @ApiPropertyOptional()
    issuedDate?: string;

    @ApiPropertyOptional()
    expiryDate?: string;

    @ApiPropertyOptional()
    certificateNumber?: string;

    @ApiPropertyOptional()
    description?: string;

    @ApiProperty()
    type: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    sortOrder: number;

    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    updatedAt: string;

    @ApiPropertyOptional()
    deletedAt?: string;

    @ApiPropertyOptional()
    isExpired?: boolean;

    /**
     * Convert from Domain model to Admin DTO
     */
    static fromDomain(certificate: Certificate): AdminCertificateResponseDto {
        return {
            id: certificate.id.toString(),
            name: certificate.name,
            image: certificate.image,
            issuedBy: certificate.issuedBy,
            issuedDate: certificate.issuedDate?.toISOString(),
            expiryDate: certificate.expiryDate?.toISOString(),
            certificateNumber: certificate.certificateNumber,
            description: certificate.description,
            type: certificate.type,
            status: certificate.status.value,
            sortOrder: certificate.sortOrder,
            createdAt: certificate.createdAt.toISOString(),
            updatedAt: certificate.updatedAt.toISOString(),
            deletedAt: certificate.deletedAt?.toISOString(),
            isExpired: certificate.isExpired(),
        };
    }
}
