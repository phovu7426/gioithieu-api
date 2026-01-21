export class UpdateProjectDto {
    name?: string;
    slug?: string;
    description?: string;
    shortDescription?: string;
    coverImage?: string;
    location?: string;
    area?: number;
    startDate?: string;
    endDate?: string;
    clientName?: string;
    budget?: number;
    images?: any;
    featured?: boolean;
    status?: string;
    sortOrder?: number;
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    ogImage?: string;
}
