import { Injectable, Inject } from '@nestjs/common';
import { IPartnerRepository } from '@/domain/repositories/intro-group.repository.interface';
import { AdminPartnerResponseDto } from './admin-partner.response.dto';

@Injectable()
export class ListPartnersUseCase {
    constructor(
        @Inject('IPartnerRepository')
        private readonly partnerRepo: IPartnerRepository,
    ) { }

    async execute(): Promise<AdminPartnerResponseDto[]> {
        const list = await this.partnerRepo.findAll();
        return list.map(item => AdminPartnerResponseDto.fromDomain(item));
    }
}
