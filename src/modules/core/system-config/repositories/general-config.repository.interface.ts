
import { GeneralConfig } from '@prisma/client';
import { IRepository } from '@/common/base/repository/repository.interface';

export const GENERAL_CONFIG_REPOSITORY = 'IGeneralConfigRepository';

export interface GeneralConfigFilter {
    status?: string;
}

export interface IGeneralConfigRepository extends IRepository<GeneralConfig> {
    getConfig(): Promise<GeneralConfig | null>;
}
