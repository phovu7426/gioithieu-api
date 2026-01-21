import { Injectable, Inject } from '@nestjs/common';
import { IPartnerRepository } from '@/domain/repositories/intro-group.repository.interface';
import { PublicPartnerResponseDto } from './public-partner.response.dto';

@Injectable()
export class ListActivePartnersUseCase {
    constructor(
        @Inject('IPartnerRepository')
        private readonly partnerRepo: IPartnerRepository,
    ) { }

    async execute(): Promise<PublicPartnerResponseDto[]> {
        const list = await this.partnerRepo.findActive();
        return list.map(item => PublicPartnerResponseDto.fromDomain(item));
    }
}
