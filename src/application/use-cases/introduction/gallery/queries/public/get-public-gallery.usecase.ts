import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IGalleryRepository } from '@/domain/repositories/intro-group.repository.interface';
import { PublicGalleryResponseDto } from './public-gallery.response.dto';

@Injectable()
export class GetPublicGalleryUseCase {
    constructor(
        @Inject('IGalleryRepository')
        private readonly galleryRepo: IGalleryRepository,
    ) { }

    async execute(slug: string): Promise<PublicGalleryResponseDto> {
        const gallery = await this.galleryRepo.findBySlug(slug);
        if (!gallery) {
            throw new NotFoundException(`Gallery with slug ${slug} not found`);
        }
        return PublicGalleryResponseDto.fromDomain(gallery);
    }
}
