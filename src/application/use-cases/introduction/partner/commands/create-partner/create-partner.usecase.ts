import { Injectable, Inject } from '@nestjs/common';
import { IPartnerRepository } from '@/domain/repositories/intro-group.repository.interface';
import { Partner } from '@/domain/models/partner.model';
import { Status } from '@/domain/value-objects/status.vo';
import { CreatePartnerDto } from './create-partner.dto';
import { AdminPartnerResponseDto } from '../../queries/admin/admin-partner.response.dto';

@Injectable()
export class CreatePartnerUseCase {
    constructor(
        @Inject('IPartnerRepository')
        private readonly partnerRepo: IPartnerRepository,
    ) { }

    async execute(dto: CreatePartnerDto): Promise<AdminPartnerResponseDto> {
        const partner = Partner.create(0n, {
            ...dto,
            status: Status.fromString(dto.status || 'active'),
            sortOrder: dto.sortOrder || 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const saved = await this.partnerRepo.save(partner);
        return AdminPartnerResponseDto.fromDomain(saved);
    }
}
