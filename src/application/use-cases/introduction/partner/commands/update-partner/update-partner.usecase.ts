import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IPartnerRepository } from '@/domain/repositories/intro-group.repository.interface';
import { Status } from '@/domain/value-objects/status.vo';
import { UpdatePartnerDto } from './update-partner.dto';
import { AdminPartnerResponseDto } from '../../queries/admin/admin-partner.response.dto';

@Injectable()
export class UpdatePartnerUseCase {
    constructor(
        @Inject('IPartnerRepository')
        private readonly partnerRepo: IPartnerRepository,
    ) { }

    async execute(id: bigint, dto: UpdatePartnerDto): Promise<AdminPartnerResponseDto> {
        const partner = await this.partnerRepo.findById(id);
        if (!partner) {
            throw new NotFoundException(`Partner with ID ${id} not found`);
        }

        const updateData: any = { ...dto };
        if (dto.status) {
            updateData.status = Status.fromString(dto.status);
        }

        partner.updateDetails(updateData);
        const updated = await this.partnerRepo.update(partner);
        return AdminPartnerResponseDto.fromDomain(updated);
    }
}
