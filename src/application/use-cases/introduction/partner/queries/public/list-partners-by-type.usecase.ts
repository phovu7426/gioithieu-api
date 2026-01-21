import { Injectable, Inject } from '@nestjs/common';
import { IPartnerRepository } from '@/domain/repositories/intro-group.repository.interface';
import { PublicPartnerResponseDto } from './public-partner.response.dto';

@Injectable()
export class ListPartnersByTypeUseCase {
    constructor(
        @Inject('IPartnerRepository')
        private readonly partnerRepo: IPartnerRepository,
    ) { }

    async execute(type: string): Promise<PublicPartnerResponseDto[]> {
        const list = await this.partnerRepo.findByType(type);
        return list.map(item => PublicPartnerResponseDto.fromDomain(item));
    }
}
