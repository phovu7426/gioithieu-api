import { Injectable, Inject } from '@nestjs/common';
import { ITestimonialRepository } from '@/domain/repositories/intro-group.repository.interface';
import { PublicTestimonialResponseDto } from './public-testimonial.response.dto';

@Injectable()
export class ListFeaturedTestimonialsUseCase {
    constructor(
        @Inject('ITestimonialRepository')
        private readonly testimonialRepo: ITestimonialRepository,
    ) { }

    async execute(limit: number): Promise<PublicTestimonialResponseDto[]> {
        const list = await this.testimonialRepo.findFeatured(limit);
        return list.map(item => PublicTestimonialResponseDto.fromDomain(item));
    }
}
