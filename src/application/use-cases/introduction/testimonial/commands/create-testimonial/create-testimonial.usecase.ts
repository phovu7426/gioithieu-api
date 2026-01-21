import { Injectable, Inject } from '@nestjs/common';
import { ITestimonialRepository } from '@/domain/repositories/intro-group.repository.interface';
import { Testimonial } from '@/domain/models/testimonial.model';
import { Status } from '@/domain/value-objects/status.vo';
import { CreateTestimonialDto } from './create-testimonial.dto';
import { AdminTestimonialResponseDto } from '../../queries/admin/admin-testimonial.response.dto';

@Injectable()
export class CreateTestimonialUseCase {
    constructor(
        @Inject('ITestimonialRepository')
        private readonly testimonialRepo: ITestimonialRepository,
    ) { }

    async execute(dto: CreateTestimonialDto): Promise<AdminTestimonialResponseDto> {
        const testimonial = Testimonial.create(0n, {
            ...dto,
            projectId: dto.projectId ? BigInt(dto.projectId) : undefined,
            featured: dto.featured || false,
            status: Status.fromString(dto.status || 'active'),
            sortOrder: dto.sortOrder || 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const saved = await this.testimonialRepo.save(testimonial);
        return AdminTestimonialResponseDto.fromDomain(saved);
    }
}
