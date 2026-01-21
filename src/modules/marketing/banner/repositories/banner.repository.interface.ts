
import { Banner } from '@prisma/client';
import { IRepository } from '@/common/base/repository/repository.interface';

export const BANNER_REPOSITORY = 'IBannerRepository';

export interface BannerFilter {
    search?: string;
    status?: string;
    locationId?: number | bigint;
}

export interface IBannerRepository extends IRepository<Banner> {
    findAllByLocation(locationCode: string): Promise<Banner[]>;
}
