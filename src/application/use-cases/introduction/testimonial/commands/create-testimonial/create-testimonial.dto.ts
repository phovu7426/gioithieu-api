export class CreateTestimonialDto {
    clientName: string;
    clientPosition?: string;
    clientCompany?: string;
    clientAvatar?: string;
    content: string;
    rating?: number;
    projectId?: string;
    featured?: boolean;
    status?: string;
    sortOrder?: number;
}
