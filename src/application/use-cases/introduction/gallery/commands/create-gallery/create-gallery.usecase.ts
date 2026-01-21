import { Injectable, Inject } from '@nestjs/common';
import { IGalleryRepository } from '@/domain/repositories/intro-group.repository.interface';
import { Gallery } from '@/domain/models/gallery.model';
import { Status } from '@/domain/value-objects/status.vo';
import { CreateGalleryDto } from './create-gallery.dto';
import { AdminGalleryResponseDto } from '../../queries/admin/admin-gallery.response.dto';

@Injectable()
export class CreateGalleryUseCase {
    constructor(
        @Inject('IGalleryRepository')
        private readonly galleryRepo: IGalleryRepository,
    ) { }

    async execute(dto: CreateGalleryDto): Promise<AdminGalleryResponseDto> {
        const gallery = Gallery.create(0n, {
            ...dto,
            images: dto.images || [],
            featured: dto.featured || false,
            status: Status.fromString(dto.status || 'active'),
            sortOrder: dto.sortOrder || 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const saved = await this.galleryRepo.save(gallery);
        return AdminGalleryResponseDto.fromDomain(saved);
    }
}
