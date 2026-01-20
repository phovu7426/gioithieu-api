
import { Gallery } from '@prisma/client';
import { IRepository } from '@/common/base/repository/repository.interface';

export const GALLERY_REPOSITORY = 'IGalleryRepository';

export interface GalleryFilter {
    search?: string;
    status?: string;
    isFeatured?: boolean;
}

export interface IGalleryRepository extends IRepository<Gallery> {
    findBySlug(slug: string): Promise<Gallery | null>;
}
