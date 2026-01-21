
import { Injectable } from '@nestjs/common';
import { Menu, Prisma } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { PrismaRepository } from '@/common/core/repositories';
import { IMenuRepository, MenuFilter } from './menu.repository.interface';

@Injectable()
export class MenuPrismaRepository extends PrismaRepository<
    Menu,
    Prisma.MenuWhereInput,
    Prisma.MenuCreateInput,
    Prisma.MenuUpdateInput,
    Prisma.MenuOrderByWithRelationInput
> implements IMenuRepository {
    private readonly defaultSelect: Prisma.MenuSelect = {
        id: true,
        code: true,
        name: true,
        icon: true,
        path: true,
        type: true,
        status: true,
        sort_order: true,
        parent_id: true,
        required_permission_id: true,
        is_public: true,
        show_in_menu: true,
        created_at: true,
        updated_at: true,
        parent: { select: { id: true, name: true, code: true } },
        required_permission: { select: { id: true, code: true, name: true } },
        menu_permissions: {
            include: {
                permission: { select: { id: true, code: true, name: true } }
            }
        }
    };

    constructor(private readonly prisma: PrismaService) {
        super(prisma.menu as unknown as any, 'sort_order:asc');
    }

    override async findAll(options: any): Promise<any> {
        return super.findAll({ ...options, select: this.defaultSelect });
    }

    override async findById(id: string | number | bigint): Promise<Menu | null> {
        return this.prisma.menu.findUnique({
            where: { id: BigInt(id) },
            select: this.defaultSelect as any,
        }) as unknown as Menu;
    }

    protected buildWhere(filter: MenuFilter): Prisma.MenuWhereInput {
        const where: Prisma.MenuWhereInput = {};

        if (filter.search) {
            where.OR = [
                { name: { contains: filter.search } },
                { code: { contains: filter.search } },
            ];
        }

        if (filter.status) {
            where.status = filter.status as any;
        }

        if (filter.type) {
            where.type = filter.type as any;
        }

        if (filter.parentId !== undefined) {
            where.parent_id = filter.parentId === null ? null : BigInt(filter.parentId);
        }

        where.deleted_at = null;

        return where;
    }

    async findAllWithChildren(filter?: MenuFilter): Promise<Menu[]> {
        return this.prisma.menu.findMany({
            where: this.buildWhere(filter || {}),
            select: this.defaultSelect as any,
            orderBy: { sort_order: 'asc' },
        }) as unknown as Menu[];
    }

    async findByCode(code: string): Promise<Menu | null> {
        return this.prisma.menu.findFirst({
            where: { code, deleted_at: null },
            select: this.defaultSelect as any,
        }) as unknown as Menu;
    }
}
