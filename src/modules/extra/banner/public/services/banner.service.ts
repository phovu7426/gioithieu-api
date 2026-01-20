import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IBannerRepository, BANNER_REPOSITORY } from '@/modules/extra/banner/repositories/banner.repository.interface';
import { IBannerLocationRepository, BANNER_LOCATION_REPOSITORY } from '@/modules/extra/banner/repositories/banner-location.repository.interface';
import { BasicStatus } from '@/shared/enums/types/basic-status.enum';

@Injectable()
export class PublicBannerService {
    constructor(
        @Inject(BANNER_REPOSITORY)
        private readonly bannerRepo: IBannerRepository,
        @Inject(BANNER_LOCATION_REPOSITORY)
        private readonly locationRepo: IBannerLocationRepository,
    ) { }

    async findByLocationCode(locationCode: string) {
        const location = await this.locationRepo.findByCode(locationCode);

        if (!location || (location as any).status !== BasicStatus.active) {
            throw new NotFoundException(`Vị trí banner with code "${locationCode}" not found or inactive`);
        }

        const banners = await this.bannerRepo.findAllByLocation(locationCode);
        return banners.map(item => this.transform(item));
    }

    async findActiveBanners(locationCode?: string) {
        const query: any = { status: BasicStatus.active };
        if (locationCode) query.search = locationCode; // repository buildWhere uses search for code too

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
        const banner = await this.bannerRepo.findById(id);

        if (!banner || (banner as any).status !== BasicStatus.active) {
            throw new NotFoundException(`Banner with ID ${id} not found or inactive`);
        }

        return this.transform(banner);
    }

    private transform(banner: any) {
        if (!banner) return banner;
        const item = { ...banner };
        if (item.id) item.id = Number(item.id);
        if (item.location_id) item.location_id = Number(item.location_id);
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