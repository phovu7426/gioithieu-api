import { IBaseRepository } from '@/common/base/repository/base.repository.interface';
import { Banner, BannerLocation } from '@/domain/models/banner.model';

export interface IBannerRepository extends IBaseRepository<Banner, bigint> {
    findByLocation(locationId: bigint): Promise<Banner[]>;
    findActiveByLocation(locationCode: string): Promise<Banner[]>;
}

export interface IBannerLocationRepository extends IBaseRepository<BannerLocation, bigint> {
    findByCode(code: string): Promise<BannerLocation | null>;
}
