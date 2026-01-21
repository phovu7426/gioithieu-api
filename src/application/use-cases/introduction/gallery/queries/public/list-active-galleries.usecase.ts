import { Injectable, Inject } from '@nestjs/common';
import { IGalleryRepository } from '@/domain/repositories/intro-group.repository.interface';
import { PublicGalleryResponseDto } from './public-gallery.response.dto';

@Injectable()
export class ListActiveGalleriesUseCase {
    constructor(
        @Inject('IGalleryRepository')
        private readonly galleryRepo: IGalleryRepository,
    ) { }

    async execute(): Promise<PublicGalleryResponseDto[]> {
        const list = await this.galleryRepo.findActive();
        return list.map(item => PublicGalleryResponseDto.fromDomain(item));
    }
}
