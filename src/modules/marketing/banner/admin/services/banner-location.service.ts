import { Injectable, ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { IBannerLocationRepository, BANNER_LOCATION_REPOSITORY, BannerLocationFilter } from '@/modules/marketing/banner/repositories/banner-location.repository.interface';
import { BasicStatus } from '@/shared/enums/types/basic-status.enum';

@Injectable()
export class BannerLocationService {
    constructor(
        @Inject(BANNER_LOCATION_REPOSITORY)
        private readonly locationRepo: IBannerLocationRepository,
    ) { }

    async getList(query: any) {
        const filter: BannerLocationFilter = {};
        if (query.search) filter.search = query.search;
        if (query.status) filter.status = query.status;

        const result = await this.locationRepo.findAll({
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
        const location = await this.locationRepo.findById(id);
        return this.transform(location);
    }

    async create(data: any) {
        const payload = { ...data };

        if (payload.code) {
            const exists = await this.locationRepo.findByCode(payload.code);
            if (exists) {
                throw new ConflictException(`Mã vị trí banner "${payload.code}" đã tồn tại`);
            }
        }

        const location = await this.locationRepo.create(payload);
        return this.getOne(Number(location.id));
    }

    async update(id: number, data: any) {
        const payload = { ...data };

        const current = await this.locationRepo.findById(id);
        if (!current) throw new NotFoundException('Banner location not found');

        if (payload.code && payload.code !== (current as any).code) {
            const exists = await this.locationRepo.findByCode(payload.code);
            if (exists) {
                throw new ConflictException(`Mã vị trí banner "${payload.code}" đã tồn tại`);
            }
        }

        await this.locationRepo.update(id, payload);
        return this.getOne(id);
    }

    async findByCode(code: string) {
        const location = await this.locationRepo.findByCode(code);
        return this.transform(location);
    }

    async delete(id: number) {
        return this.locationRepo.delete(id);
    }

    async changeStatus(id: number, status: BasicStatus) {
        return this.update(id, { status: status as any });
    }

    private transform(location: any) {
        if (!location) return location;
        const item = { ...location };
        if (item.id) item.id = Number(item.id);
        return item;
    }
}
