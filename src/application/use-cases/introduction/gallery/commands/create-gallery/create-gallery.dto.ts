export class CreateGalleryDto {
    title: string;
    slug: string;
    description?: string;
    coverImage?: string;
    images?: any;
    featured?: boolean;
    status?: string;
    sortOrder?: number;
}
