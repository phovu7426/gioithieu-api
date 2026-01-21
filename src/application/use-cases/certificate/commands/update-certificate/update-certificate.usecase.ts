import { Injectable, Inject } from '@nestjs/common';
import { ICertificateRepository } from '@/domain/repositories/certificate.repository.interface';
import { Status } from '@/domain/value-objects';
import { UpdateCertificateDto } from './update-certificate.dto';
import { AdminCertificateResponseDto } from '../../queries/admin/get-certificate/admin-certificate.response.dto';
import { EntityNotFoundException, ValidationException } from '@/domain/exceptions';

/**
 * Update Certificate Use Case
 * Handles the business logic for updating an existing certificate
 */
@Injectable()
export class UpdateCertificateUseCase {
    constructor(
        @Inject('ICertificateRepository')
        private readonly certificateRepo: ICertificateRepository,
    ) { }

    async execute(id: bigint, dto: UpdateCertificateDto): Promise<AdminCertificateResponseDto> {
        // 1. Find existing certificate
        const certificate = await this.certificateRepo.findById(id);
        if (!certificate) {
            throw new EntityNotFoundException('Certificate', id.toString());
        }

        // 2. Validate certificate number uniqueness if changed
        if (dto.certificateNumber && dto.certificateNumber !== certificate.certificateNumber) {
            const exists = await this.certificateRepo.existsByCertificateNumber(dto.certificateNumber, id);
            if (exists) {
                throw new ValidationException(`Certificate number ${dto.certificateNumber} already exists`);
            }
        }

        // 3. Apply changes using domain methods
        if (dto.name || dto.image || dto.issuedBy || dto.issuedDate || dto.expiryDate || dto.certificateNumber || dto.description || dto.type) {
            certificate.updateDetails({
                name: dto.name,
                image: dto.image,
                issuedBy: dto.issuedBy,
                issuedDate: dto.issuedDate ? new Date(dto.issuedDate) : undefined,
                expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
                certificateNumber: dto.certificateNumber,
                description: dto.description,
                type: dto.type,
            });
        }

        if (dto.status) {
            const newStatus = Status.fromString(dto.status);
            if (newStatus.isActive()) {
                certificate.activate();
            } else {
                certificate.deactivate();
            }
        }

        if (dto.sortOrder !== undefined) {
            certificate.updateSortOrder(dto.sortOrder);
        }

        // 4. Save changes
        const updated = await this.certificateRepo.update(certificate);

        // 5. Return DTO
        return AdminCertificateResponseDto.fromDomain(updated);
    }
}
