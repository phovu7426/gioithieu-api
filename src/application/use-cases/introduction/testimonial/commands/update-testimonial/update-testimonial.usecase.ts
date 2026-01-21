import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ITestimonialRepository } from '@/domain/repositories/intro-group.repository.interface';
import { Status } from '@/domain/value-objects/status.vo';
import { UpdateTestimonialDto } from './update-testimonial.dto';
import { AdminTestimonialResponseDto } from '../../queries/admin/admin-testimonial.response.dto';

@Injectable()
export class UpdateTestimonialUseCase {
    constructor(
        @Inject('ITestimonialRepository')
        private readonly testimonialRepo: ITestimonialRepository,
    ) { }

    async execute(id: bigint, dto: UpdateTestimonialDto): Promise<AdminTestimonialResponseDto> {
        const testimonial = await this.testimonialRepo.findById(id);
        if (!testimonial) {
            throw new NotFoundException(`Testimonial with ID ${id} not found`);
        }

        const updateData: any = { ...dto };
        if (dto.status) {
            updateData.status = Status.fromString(dto.status);
        }

        testimonial.updateDetails(updateData);
        const updated = await this.testimonialRepo.update(testimonial);
        return AdminTestimonialResponseDto.fromDomain(updated);
    }
}
