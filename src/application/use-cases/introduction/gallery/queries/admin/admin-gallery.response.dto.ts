import { Gallery } from '@/domain/models/gallery.model';

export class AdminGalleryResponseDto {
    id: string;
    title: string;
    slug: string;
    description?: string;
    coverImage?: string;
    images: any;
    featured: boolean;
    status: string;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;

    static fromDomain(gallery: Gallery): AdminGalleryResponseDto {
        const obj = gallery.toObject();
        return {
            ...obj,
            id: obj.id.toString(),
            createdAt: obj.createdAt.toISOString(),
            updatedAt: obj.updatedAt.toISOString(),
        };
    }
}
