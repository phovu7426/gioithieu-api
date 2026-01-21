import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IGalleryRepository } from '@/domain/repositories/intro-group.repository.interface';

@Injectable()
export class DeleteGalleryUseCase {
    constructor(
        @Inject('IGalleryRepository')
        private readonly galleryRepo: IGalleryRepository,
    ) { }

    async execute(id: bigint): Promise<void> {
        const gallery = await this.galleryRepo.findById(id);
        if (!gallery) {
            throw new NotFoundException(`Gallery with ID ${id} not found`);
        }

        gallery.softDelete();
        await this.galleryRepo.update(gallery);
    }
}
