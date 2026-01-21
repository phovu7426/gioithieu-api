
import { Menu } from '@prisma/client';
import { IRepository } from '@/common/base/repository/repository.interface';

export const MENU_REPOSITORY = 'IMenuRepository';

export interface MenuFilter {
    search?: string;
    status?: string;
    parentId?: number | bigint;
    type?: string;
}

export interface IMenuRepository extends IRepository<Menu> {
    findAllWithChildren(filter?: MenuFilter): Promise<Menu[]>;
    findByCode(code: string): Promise<Menu | null>;
}
