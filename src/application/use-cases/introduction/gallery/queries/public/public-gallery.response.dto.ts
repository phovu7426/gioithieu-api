import { Gallery } from '@/domain/models/gallery.model';

export class PublicGalleryResponseDto {
    id: string;
    title: string;
    slug: string;
    description?: string;
    coverImage?: string;
    images: any;

    static fromDomain(gallery: Gallery): PublicGalleryResponseDto {
        const obj = gallery.toObject();
        return {
            id: obj.id.toString(),
            title: obj.title,
            slug: obj.slug,
            description: obj.description,
            coverImage: obj.coverImage,
            images: obj.images,
        };
    }
}
