
import { Partner } from '@prisma/client';
import { IRepository } from '@/common/base/repository/repository.interface';

export const PARTNER_REPOSITORY = 'IPartnerRepository';

export interface PartnerFilter {
    search?: string;
    status?: string;
    type?: string;
}

export interface IPartnerRepository extends IRepository<Partner> {
}
