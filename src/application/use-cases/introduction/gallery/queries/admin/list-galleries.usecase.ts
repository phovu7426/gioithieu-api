import { Injectable, Inject } from '@nestjs/common';
import { IGalleryRepository } from '@/domain/repositories/intro-group.repository.interface';
import { AdminGalleryResponseDto } from './admin-gallery.response.dto';

@Injectable()
export class ListGalleriesUseCase {
    constructor(
        @Inject('IGalleryRepository')
        private readonly galleryRepo: IGalleryRepository,
    ) { }

    async execute(): Promise<AdminGalleryResponseDto[]> {
        const list = await this.galleryRepo.findAll();
        return list.map(item => AdminGalleryResponseDto.fromDomain(item));
    }
}
