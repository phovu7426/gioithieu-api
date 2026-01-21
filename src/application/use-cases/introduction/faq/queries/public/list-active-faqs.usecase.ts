import { Injectable, Inject } from '@nestjs/common';
import { IFaqRepository } from '@/domain/repositories/intro-group.repository.interface';
import { PublicFaqResponseDto } from './public-faq.response.dto';

@Injectable()
export class ListActiveFaqsUseCase {
    constructor(
        @Inject('IFaqRepository')
        private readonly faqRepo: IFaqRepository,
    ) { }

    async execute(): Promise<PublicFaqResponseDto[]> {
        const list = await this.faqRepo.findActive();
        return list.map(item => PublicFaqResponseDto.fromDomain(item));
    }
}
