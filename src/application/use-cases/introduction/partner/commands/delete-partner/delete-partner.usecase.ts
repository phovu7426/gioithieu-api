import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IPartnerRepository } from '@/domain/repositories/intro-group.repository.interface';

@Injectable()
export class DeletePartnerUseCase {
    constructor(
        @Inject('IPartnerRepository')
        private readonly partnerRepo: IPartnerRepository,
    ) { }

    async execute(id: bigint): Promise<void> {
        const partner = await this.partnerRepo.findById(id);
        if (!partner) {
            throw new NotFoundException(`Partner with ID ${id} not found`);
        }

        partner.softDelete();
        await this.partnerRepo.update(partner);
    }
}
