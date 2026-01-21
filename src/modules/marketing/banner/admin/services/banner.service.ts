import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IBannerRepository, BANNER_REPOSITORY, BannerFilter } from '@/modules/marketing/banner/repositories/banner.repository.interface';
import { IBannerLocationRepository, BANNER_LOCATION_REPOSITORY } from '@/modules/marketing/banner/repositories/banner-location.repository.interface';
import { BasicStatus } from '@/shared/enums/types/basic-status.enum';
import { BaseContentService } from '@/common/base/services';
import { Banner } from '@prisma/client';

@Injectable()
export class BannerService extends BaseContentService<Banner, IBannerRepository> {
    constructor(
        @Inject(BANNER_REPOSITORY)
        private readonly bannerRepo: IBannerRepository,
        @Inject(BANNER_LOCATION_REPOSITORY)
        private readonly locationRepo: IBannerLocationRepository,
    ) {
        super(bannerRepo);
    }

    protected defaultSort = 'sort_order:asc,created_at:desc';

    async getList(query: any) {
        const filter: BannerFilter = {};
        if (query.search) filter.search = query.search;
        if (query.status) filter.status = query.status;
        if (query.locationId) filter.locationId = query.locationId;

        return super.getList({
            page: query.page,
            limit: query.limit,
            sort: query.sort,
            filter,
        });
    }

    async getSimpleList(query: any) {
        return this.getList({
            ...query,
            limit: query.limit ?? 50,
        });
    }

    protected async beforeCreate(data: any) {
        if (data.location_id) {
            const location = await this.locationRepo.findById(data.location_id);
            if (!location) {
                throw new NotFoundException(`Vị trí banner với ID ${data.location_id} không tồn tại`);
            }
        }
        return data;
    }

    protected async beforeUpdate(id: number | bigint, data: any) {
        const current = await this.bannerRepo.findById(id);
        if (!current) throw new NotFoundException('Banner not found');

        if (data.location_id && data.location_id !== Number((current as any).location_id)) {
            const location = await this.locationRepo.findById(data.location_id);
            if (!location) {
                throw new NotFoundException(`Vị trí banner với ID ${data.location_id} không tồn tại`);
            }
        }
        return data;
    }

    async findByLocationCode(locationCode: string) {
        const location = await this.locationRepo.findByCode(locationCode);
        if (!location || (location as any).status !== BasicStatus.active) {
            throw new NotFoundException(`Vị trí banner với mã "${locationCode}" không tồn tại hoặc không hoạt động`);
        }

        const banners = await this.bannerRepo.findAllByLocation(locationCode);
        return banners.map(item => this.transform(item));
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
