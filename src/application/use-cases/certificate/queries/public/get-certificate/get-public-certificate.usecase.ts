import { Injectable, Inject } from '@nestjs/common';
import { ICertificateRepository } from '@/domain/repositories/certificate.repository.interface';
import { PublicCertificateResponseDto } from './public-certificate.response.dto';
import { EntityNotFoundException } from '@/domain/exceptions';

/**
 * Get Certificate Use Case (Public)
 * Retrieves a single active certificate by ID for public users
 */
@Injectable()
export class GetPublicCertificateUseCase {
    constructor(
        @Inject('ICertificateRepository')
        private readonly certificateRepo: ICertificateRepository,
    ) { }

    async execute(id: bigint): Promise<PublicCertificateResponseDto> {
        const certificate = await this.certificateRepo.findById(id);

        if (!certificate || !certificate.isActive()) {
            throw new EntityNotFoundException('Certificate', id.toString());
        }

        return PublicCertificateResponseDto.fromDomain(certificate);
    }
}
