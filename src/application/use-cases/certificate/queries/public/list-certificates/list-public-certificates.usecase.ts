import { Injectable, Inject } from '@nestjs/common';
import { ICertificateRepository } from '@/domain/repositories/certificate.repository.interface';
import { PublicCertificateResponseDto } from '../get-certificate/public-certificate.response.dto';

/**
 * List Public Certificates Use Case
 * Retrieves all active certificates for public users
 */
@Injectable()
export class ListPublicCertificatesUseCase {
    constructor(
        @Inject('ICertificateRepository')
        private readonly certificateRepo: ICertificateRepository,
    ) { }

    async execute(): Promise<PublicCertificateResponseDto[]> {
        const certificates = await this.certificateRepo.findActive();
        return certificates.map((cert) => PublicCertificateResponseDto.fromDomain(cert));
    }
}
