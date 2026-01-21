import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IFaqRepository } from '@/domain/repositories/intro-group.repository.interface';
import { AdminFaqResponseDto } from './admin-faq.response.dto';

@Injectable()
export class GetFaqUseCase {
    constructor(
        @Inject('IFaqRepository')
        private readonly faqRepo: IFaqRepository,
    ) { }

    async execute(id: bigint): Promise<AdminFaqResponseDto> {
        const faq = await this.faqRepo.findById(id);
        if (!faq) {
            throw new NotFoundException(`FAQ with ID ${id} not found`);
        }
        return AdminFaqResponseDto.fromDomain(faq);
    }
}
