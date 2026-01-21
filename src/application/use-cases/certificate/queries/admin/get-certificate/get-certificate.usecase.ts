import { Injectable, Inject } from '@nestjs/common';
import { ICertificateRepository } from '@/domain/repositories/certificate.repository.interface';
import { AdminCertificateResponseDto } from './admin-certificate.response.dto';
import { EntityNotFoundException } from '@/domain/exceptions';

/**
 * Get Certificate Use Case (Admin)
 * Retrieves a single certificate by ID for admin users
 */
@Injectable()
export class GetCertificateUseCase {
    constructor(
        @Inject('ICertificateRepository')
        private readonly certificateRepo: ICertificateRepository,
    ) { }

    async execute(id: bigint): Promise<AdminCertificateResponseDto> {
        const certificate = await this.certificateRepo.findById(id);

        if (!certificate) {
            throw new EntityNotFoundException('Certificate', id.toString());
        }

        return AdminCertificateResponseDto.fromDomain(certificate);
    }
}
