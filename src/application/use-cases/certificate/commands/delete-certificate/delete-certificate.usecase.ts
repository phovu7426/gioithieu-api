import { Injectable, Inject } from '@nestjs/common';
import { ICertificateRepository } from '@/domain/repositories/certificate.repository.interface';
import { EntityNotFoundException } from '@/domain/exceptions';

/**
 * Delete Certificate Use Case
 * Handles the business logic for soft-deleting a certificate
 */
@Injectable()
export class DeleteCertificateUseCase {
    constructor(
        @Inject('ICertificateRepository')
        private readonly certificateRepo: ICertificateRepository,
    ) { }

    async execute(id: bigint): Promise<void> {
        // 1. Find existing certificate
        const certificate = await this.certificateRepo.findById(id);
        if (!certificate) {
            throw new EntityNotFoundException('Certificate', id.toString());
        }

        // 2. Soft delete using domain method
        certificate.softDelete();

        // 3. Save changes
        await this.certificateRepo.update(certificate);
    }
}
