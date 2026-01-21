
import { Group } from '@prisma/client';
import { IRepository } from '@/common/base/repository/repository.interface';

export const GROUP_REPOSITORY = 'IGroupRepository';

export interface GroupFilter {
    search?: string;
    type?: string;
    status?: string;
    contextId?: number;
    ownerId?: number;
}

export interface IGroupRepository extends IRepository<Group> {
    findByCode(code: string): Promise<Group | null>;
}
