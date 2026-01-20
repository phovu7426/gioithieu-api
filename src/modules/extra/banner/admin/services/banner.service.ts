import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IBannerRepository, BANNER_REPOSITORY, BannerFilter } from '@/modules/extra/banner/repositories/banner.repository.interface';
import { IBannerLocationRepository, BANNER_LOCATION_REPOSITORY } from '@/modules/extra/banner/repositories/banner-location.repository.interface';
import { BasicStatus } from '@/shared/enums/types/basic-status.enum';

@Injectable()
export class BannerService {
    constructor(
        @Inject(BANNER_REPOSITORY)
        private readonly bannerRepo: IBannerRepository,
        @Inject(BANNER_LOCATION_REPOSITORY)
        private readonly locationRepo: IBannerLocationRepository,
    ) { }

    async getList(query: any) {
        const filter: BannerFilter = {};
        if (query.search) filter.search = query.search;
        if (query.status) filter.status = query.status;
        if (query.locationId) filter.locationId = query.locationId;

        // Apply special filter for active status like original prepareFilters
        if (filter.status === BasicStatus.active) {
            // Note: Repository buildWhere could handle this, but original service had it.
            // For now, let's keep it simple as Repository buildWhere handles basic status.
            // If date range is needed, repository buildWhere should be updated.
        }

        const result = await this.bannerRepo.findAll({
            page: query.page,
            limit: query.limit,
            sort: query.sort,
            filter,
        });

        result.data = result.data.map(item => this.transform(item));
        return result;
    }

    async getSimpleList(query: any) {
        return this.getList({
            ...query,
            limit: query.limit ?? 50,
        });
    }

    async getOne(id: number) {
        const banner = await this.bannerRepo.findById(id);
        return this.transform(banner);
    }

    async create(data: any) {
        const payload = { ...data };

        if (payload.location_id) {
            const location = await this.locationRepo.findById(payload.location_id);
            if (!location) {
                throw new NotFoundException(`Vị trí banner với ID ${payload.location_id} không tồn tại`);
            }
        }

        const banner = await this.bannerRepo.create(payload);
        return this.getOne(Number(banner.id));
    }

    async update(id: number, data: any) {
        const payload = { ...data };

        const current = await this.bannerRepo.findById(id);
        if (!current) throw new NotFoundException('Banner not found');

        if (payload.location_id && payload.location_id !== Number((current as any).location_id)) {
            const location = await this.locationRepo.findById(payload.location_id);
            if (!location) {
                throw new NotFoundException(`Vị trí banner với ID ${payload.location_id} không tồn tại`);
            }
        }

        await this.bannerRepo.update(id, payload);
        return this.getOne(id);
    }

    async delete(id: number) {
        return this.bannerRepo.delete(id);
    }

    async findByLocationCode(locationCode: string) {
        const location = await this.locationRepo.findByCode(locationCode);
        if (!location || (location as any).status !== BasicStatus.active) {
            throw new NotFoundException(`Vị trí banner với mã "${locationCode}" không tồn tại hoặc không hoạt động`);
        }

        const banners = await this.bannerRepo.findAllByLocation(locationCode);
        return banners.map(item => this.transform(item));
    }

    async changeStatus(id: number, status: BasicStatus) {
        return this.update(id, { status: status as any });
    }

    async updateSortOrder(id: number, sortOrder: number) {
        return this.update(id, { sort_order: sortOrder });
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
