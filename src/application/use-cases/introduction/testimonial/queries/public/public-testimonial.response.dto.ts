import { Testimonial } from '@/domain/models/testimonial.model';

export class PublicTestimonialResponseDto {
    id: string;
    clientName: string;
    clientPosition?: string;
    clientCompany?: string;
    clientAvatar?: string;
    content: string;
    rating?: number;

    static fromDomain(testimonial: Testimonial): PublicTestimonialResponseDto {
        const obj = testimonial.toObject();
        return {
            id: obj.id.toString(),
            clientName: obj.clientName,
            clientPosition: obj.clientPosition,
            clientCompany: obj.clientCompany,
            clientAvatar: obj.clientAvatar,
            content: obj.content,
            rating: obj.rating,
        };
    }
}
