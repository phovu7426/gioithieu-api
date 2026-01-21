import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ITestimonialRepository } from '@/domain/repositories/intro-group.repository.interface';
import { AdminTestimonialResponseDto } from './admin-testimonial.response.dto';

@Injectable()
export class GetTestimonialUseCase {
    constructor(
        @Inject('ITestimonialRepository')
        private readonly testimonialRepo: ITestimonialRepository,
    ) { }

    async execute(id: bigint): Promise<AdminTestimonialResponseDto> {
        const testimonial = await this.testimonialRepo.findById(id);
        if (!testimonial) {
            throw new NotFoundException(`Testimonial with ID ${id} not found`);
        }
        return AdminTestimonialResponseDto.fromDomain(testimonial);
    }
}
