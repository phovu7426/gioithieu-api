import { Injectable, Inject } from '@nestjs/common';
import { IFaqRepository } from '@/domain/repositories/intro-group.repository.interface';
import { PublicFaqResponseDto } from './public-faq.response.dto';

@Injectable()
export class ListPopularFaqsUseCase {
    constructor(
        @Inject('IFaqRepository')
        private readonly faqRepo: IFaqRepository,
    ) { }

    async execute(limit: number): Promise<PublicFaqResponseDto[]> {
        // Since ITestimonialRepository had findFeatured, I should check IFaqRepository for findPopular or similar.
        // Looking at intro-group.prisma.repository.ts, IFaqRepository only has findActive().
        // I will use findActive and sort by view count for now, or assume findActive returns sorted list.
        // Actually, let's see intro-group.repository.interface.ts again.
        const list = await this.faqRepo.findActive();
        return list
            .sort((a, b) => Number(BigInt(b.toObject().viewCount) - BigInt(a.toObject().viewCount)))
            .slice(0, limit)
            .map(item => PublicFaqResponseDto.fromDomain(item));
    }
}
