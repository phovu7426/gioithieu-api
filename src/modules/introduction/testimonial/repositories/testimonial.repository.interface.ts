
import { Testimonial } from '@prisma/client';
import { IRepository } from '@/common/base/repository/repository.interface';

export const TESTIMONIAL_REPOSITORY = 'ITestimonialRepository';

export interface TestimonialFilter {
    search?: string;
    status?: string;
    projectId?: number | bigint;
}

export interface ITestimonialRepository extends IRepository<Testimonial> {
}
