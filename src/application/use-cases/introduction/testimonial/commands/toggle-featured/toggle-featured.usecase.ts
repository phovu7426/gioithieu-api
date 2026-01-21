import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ITestimonialRepository } from '@/domain/repositories/intro-group.repository.interface';
import { AdminTestimonialResponseDto } from '../../queries/admin/admin-testimonial.response.dto';

@Injectable()
export class ToggleTestimonialFeaturedUseCase {
    constructor(
        @Inject('ITestimonialRepository')
        private readonly testimonialRepo: ITestimonialRepository,
    ) { }

    async execute(id: bigint, featured: boolean): Promise<AdminTestimonialResponseDto> {
        const testimonial = await this.testimonialRepo.findById(id);
        if (!testimonial) {
            throw new NotFoundException(`Testimonial with ID ${id} not found`);
        }

        testimonial.toggleFeatured(featured);
        const updated = await this.testimonialRepo.update(testimonial);
        return AdminTestimonialResponseDto.fromDomain(updated);
    }
}
