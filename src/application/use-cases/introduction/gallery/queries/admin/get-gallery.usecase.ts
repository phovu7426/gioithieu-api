import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IGalleryRepository } from '@/domain/repositories/intro-group.repository.interface';
import { AdminGalleryResponseDto } from './admin-gallery.response.dto';

@Injectable()
export class GetGalleryUseCase {
    constructor(
        @Inject('IGalleryRepository')
        private readonly galleryRepo: IGalleryRepository,
    ) { }

    async execute(id: bigint): Promise<AdminGalleryResponseDto> {
        const gallery = await this.galleryRepo.findById(id);
        if (!gallery) {
            throw new NotFoundException(`Gallery with ID ${id} not found`);
        }
        return AdminGalleryResponseDto.fromDomain(gallery);
    }
}
