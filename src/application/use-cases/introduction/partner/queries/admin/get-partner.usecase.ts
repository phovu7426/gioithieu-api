import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IPartnerRepository } from '@/domain/repositories/intro-group.repository.interface';
import { AdminPartnerResponseDto } from './admin-partner.response.dto';

@Injectable()
export class GetPartnerUseCase {
    constructor(
        @Inject('IPartnerRepository')
        private readonly partnerRepo: IPartnerRepository,
    ) { }

    async execute(id: bigint): Promise<AdminPartnerResponseDto> {
        const partner = await this.partnerRepo.findById(id);
        if (!partner) {
            throw new NotFoundException(`Partner with ID ${id} not found`);
        }
        return AdminPartnerResponseDto.fromDomain(partner);
    }
}
