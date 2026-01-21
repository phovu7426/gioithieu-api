import { Injectable, Inject } from '@nestjs/common';
import { ITestimonialRepository } from '@/domain/repositories/intro-group.repository.interface';
import { AdminTestimonialResponseDto } from './admin-testimonial.response.dto';

@Injectable()
export class ListTestimonialsUseCase {
    constructor(
        @Inject('ITestimonialRepository')
        private readonly testimonialRepo: ITestimonialRepository,
    ) { }

    async execute(): Promise<AdminTestimonialResponseDto[]> {
        const list = await this.testimonialRepo.findAll();
        return list.map(item => AdminTestimonialResponseDto.fromDomain(item));
    }
}
