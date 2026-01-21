import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IFaqRepository } from '@/domain/repositories/intro-group.repository.interface';
import { PublicFaqResponseDto } from './public-faq.response.dto';

@Injectable()
export class GetPublicFaqUseCase {
    constructor(
        @Inject('IFaqRepository')
        private readonly faqRepo: IFaqRepository,
    ) { }

    async execute(id: bigint): Promise<PublicFaqResponseDto> {
        const faq = await this.faqRepo.findById(id);
        if (!faq) {
            throw new NotFoundException(`FAQ with ID ${id} not found`);
        }

        faq.incrementView();
        await this.faqRepo.update(faq);

        return PublicFaqResponseDto.fromDomain(faq);
    }
}
