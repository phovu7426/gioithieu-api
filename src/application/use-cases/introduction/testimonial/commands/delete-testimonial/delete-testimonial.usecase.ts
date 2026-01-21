import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ITestimonialRepository } from '@/domain/repositories/intro-group.repository.interface';

@Injectable()
export class DeleteTestimonialUseCase {
    constructor(
        @Inject('ITestimonialRepository')
        private readonly testimonialRepo: ITestimonialRepository,
    ) { }

    async execute(id: bigint): Promise<void> {
        const testimonial = await this.testimonialRepo.findById(id);
        if (!testimonial) {
            throw new NotFoundException(`Testimonial with ID ${id} not found`);
        }

        testimonial.softDelete();
        await this.testimonialRepo.update(testimonial);
    }
}
