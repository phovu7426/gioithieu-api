import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IFaqRepository } from '@/domain/repositories/intro-group.repository.interface';

@Injectable()
export class MarkFaqHelpfulUseCase {
    constructor(
        @Inject('IFaqRepository')
        private readonly faqRepo: IFaqRepository,
    ) { }

    async execute(id: bigint): Promise<void> {
        const faq = await this.faqRepo.findById(id);
        if (!faq) {
            throw new NotFoundException(`FAQ with ID ${id} not found`);
        }

        // Add incrementHelpful to domain model and update
        // (Will add to model in next step)
        faq.incrementHelpful();
        await this.faqRepo.update(faq);
    }
}
