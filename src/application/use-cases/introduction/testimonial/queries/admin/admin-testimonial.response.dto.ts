import { Testimonial } from '@/domain/models/testimonial.model';

export class AdminTestimonialResponseDto {
    id: string;
    clientName: string;
    clientPosition?: string;
    clientCompany?: string;
    clientAvatar?: string;
    content: string;
    rating?: number;
    projectId?: string;
    featured: boolean;
    status: string;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;

    static fromDomain(testimonial: Testimonial): AdminTestimonialResponseDto {
        const obj = testimonial.toObject();
        return {
            ...obj,
            id: obj.id.toString(),
            createdAt: obj.createdAt.toISOString(),
            updatedAt: obj.updatedAt.toISOString(),
        };
    }
}
