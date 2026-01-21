import { Injectable, Inject } from '@nestjs/common';
import { IGalleryRepository, IPartnerRepository } from '@/domain/repositories/intro-group.repository.interface';
import { Gallery } from '@/domain/models/gallery.model';
import { Partner } from '@/domain/models/partner.model';
import { Status } from '@/domain/value-objects/status.vo';

@Injectable()
export class ListGalleryUseCase {
    constructor(@Inject('IGalleryRepository') private readonly repo: IGalleryRepository) { }
    async execute() { return (await this.repo.findAll()).map(i => i.toObject()); }
}

@Injectable()
export class CreateGalleryUseCase {
    constructor(@Inject('IGalleryRepository') private readonly repo: IGalleryRepository) { }
    async execute(dto: any) {
        const item = Gallery.create(0n, {
            ...dto,
            status: Status.fromString(dto.status || 'active'),
            sortOrder: dto.sortOrder || 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return (await this.repo.save(item)).toObject();
    }
}

@Injectable()
export class ListPartnersUseCase {
    constructor(@Inject('IPartnerRepository') private readonly repo: IPartnerRepository) { }
    async execute() { return (await this.repo.findAll()).map(i => i.toObject()); }
}

@Injectable()
export class CreatePartnerUseCase {
    constructor(@Inject('IPartnerRepository') private readonly repo: IPartnerRepository) { }
    async execute(dto: any) {
        const item = Partner.create(0n, {
            ...dto,
            status: Status.fromString(dto.status || 'active'),
            sortOrder: dto.sortOrder || 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return (await this.repo.save(item)).toObject();
    }
}
