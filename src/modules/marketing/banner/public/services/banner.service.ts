import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IBannerRepository, BANNER_REPOSITORY } from '@/modules/marketing/banner/repositories/banner.repository.interface';
import { IBannerLocationRepository, BANNER_LOCATION_REPOSITORY } from '@/modules/marketing/banner/repositories/banner-location.repository.interface';
import { BasicStatus } from '@/shared/enums/types/basic-status.enum';
import { BaseService } from '@/common/core/services';
import { Banner } from '@prisma/client';

@Injectable()
export class PublicBannerService extends BaseService<Banner, IBannerRepository> {
    constructor(
        @Inject(BANNER_REPOSITORY)
        private readonly bannerRepo: IBannerRepository,
        @Inject(BANNER_LOCATION_REPOSITORY)
        private readonly locationRepo: IBannerLocationRepository,
    ) {
        super(bannerRepo);
    }

    async findByLocationCode(locationCode: string) {
        const location = await this.locationRepo.findByCode(locationCode);

        if (!location || (location as any).status !== BasicStatus.active) {
            throw new NotFoundException(`Vị trí banner with code "${locationCode}" not found or inactive`);
        }

        const banners = await this.bannerRepo.findAllByLocation(locationCode);
        return banners.map(item => this.transform(item));
    }

    async findActiveBanners(locationCode?: string) {
        const locations = await this.locationRepo.findAll({
            filter: { status: BasicStatus.active, search: locationCode },
            limit: 1000
        });

        const result: { [locationCode: string]: any[] } = {};

        for (const location of locations.data) {
            const banners = await this.bannerRepo.findAllByLocation((location as any).code);
            if (banners.length > 0) {
                result[(location as any).code] = banners.map(item => this.transform(item));
            }
        }

        return result;
    }

    async findBannerById(id: number) {
        const banner = await super.getOne(id);
        if (!banner || (banner as any).status !== BasicStatus.active) {
            throw new NotFoundException(`Banner with ID ${id} not found or inactive`);
        }
        return banner;
    }

    protected transform(banner: any) {
        if (!banner) return banner;
        const item = super.transform(banner) as any;
        if (item.location) {
            item.location = {
                id: Number(item.location.id),
                name: item.location.name,
                code: item.location.code,
            };
        }
        return item;
    }
}
