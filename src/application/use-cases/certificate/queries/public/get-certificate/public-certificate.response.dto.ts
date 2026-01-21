import { Certificate } from '@/domain/models/certificate.model';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Public Certificate Response DTO
 * Contains only public-facing certificate information
 * Hides internal fields like status, sort_order, deleted_at, etc.
 */
export class PublicCertificateResponseDto {
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
    description?: string;

    @ApiProperty()
    type: string;

    /**
     * Convert from Domain model to Public DTO
     * Only includes fields that should be visible to public users
     */
    static fromDomain(certificate: Certificate): PublicCertificateResponseDto {
        return {
            id: certificate.id.toString(),
            name: certificate.name,
            image: certificate.image,
            issuedBy: certificate.issuedBy,
            issuedDate: certificate.issuedDate?.toISOString(),
            description: certificate.description,
            type: certificate.type,
        };
    }
}
