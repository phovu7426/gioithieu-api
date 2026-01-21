import { Injectable, Inject } from '@nestjs/common';
import { IBannerRepository } from '@/domain/repositories/marketing.repository.interface';

@Injectable()
export class ListActiveBannersUseCase {
    constructor(@Inject('IBannerRepository') private readonly repo: IBannerRepository) { }
    async execute(locationCode: string) {
        const list = await this.repo.findActiveByLocation(locationCode);
        return list.map(b => b.toObject());
    }
}

@Injectable()
export class ListAllBannersUseCase {
    constructor(@Inject('IBannerRepository') private readonly repo: IBannerRepository) { }
    async execute() {
        return (await this.repo.findAll()).map(b => b.toObject());
    }
}
