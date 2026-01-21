import { Injectable, Inject } from '@nestjs/common';
import { ITestimonialRepository } from '@/domain/repositories/intro-group.repository.interface';
import { PublicTestimonialResponseDto } from './public-testimonial.response.dto';

@Injectable()
export class ListProjectTestimonialsUseCase {
    constructor(
        @Inject('ITestimonialRepository')
        private readonly testimonialRepo: ITestimonialRepository,
    ) { }

    async execute(projectId: bigint): Promise<PublicTestimonialResponseDto[]> {
        const list = await this.testimonialRepo.findByProject(projectId);
        return list.map(item => PublicTestimonialResponseDto.fromDomain(item));
    }
}
