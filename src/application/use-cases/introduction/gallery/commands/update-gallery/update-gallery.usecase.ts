import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IGalleryRepository } from '@/domain/repositories/intro-group.repository.interface';
import { Status } from '@/domain/value-objects/status.vo';
import { UpdateGalleryDto } from './update-gallery.dto';
import { AdminGalleryResponseDto } from '../../queries/admin/admin-gallery.response.dto';

@Injectable()
export class UpdateGalleryUseCase {
    constructor(
        @Inject('IGalleryRepository')
        private readonly galleryRepo: IGalleryRepository,
    ) { }

    async execute(id: bigint, dto: UpdateGalleryDto): Promise<AdminGalleryResponseDto> {
        const gallery = await this.galleryRepo.findById(id);
        if (!gallery) {
            throw new NotFoundException(`Gallery with ID ${id} not found`);
        }

        const updateData: any = { ...dto };
        if (dto.status) {
            updateData.status = Status.fromString(dto.status);
        }

        gallery.updateDetails(updateData);
        const updated = await this.galleryRepo.update(gallery);
        return AdminGalleryResponseDto.fromDomain(updated);
    }
}
