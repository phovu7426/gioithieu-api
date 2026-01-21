import { Injectable, Inject, Logger, BadRequestException, NotFoundException, forwardRef } from '@nestjs/common';
import { IMenuRepository, MENU_REPOSITORY, MenuFilter } from '@/modules/core/menu/repositories/menu.repository.interface';
import { RbacService } from '@/modules/core/rbac/services/rbac.service';
import { RequestContext } from '@/common/utils/request-context.util';
import { BasicStatus } from '@/shared/enums/types/basic-status.enum';
import { MenuTreeItem } from '@/modules/core/menu/admin/interfaces/menu-tree-item.interface';

@Injectable()
export class MenuService {
  private readonly logger = new Logger(MenuService.name);

  constructor(
    @Inject(MENU_REPOSITORY)
    private readonly menuRepo: IMenuRepository,
    @Inject(forwardRef(() => RbacService))
    private readonly rbacService: RbacService,
  ) { }

  async getList(query: any) {
    const filter: MenuFilter = {};
    if (query.search) filter.search = query.search;
    if (query.status) filter.status = query.status;
    if (query.type) filter.type = query.type;
    if (query.parentId !== undefined) filter.parentId = query.parentId;

    const result = await this.menuRepo.findAll({
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      filter,
    });

    result.data = result.data.map(item => this.convertBigIntFields(item));
    return result;
  }

  async getSimpleList(query: any) {
    return this.getList({
      ...query,
      limit: query.limit ?? 50,
      sort: query.sort ?? 'sort_order:ASC',
    });
  }

  async getOne(id: number) {
    const menu = await this.menuRepo.findById(id);
    return this.convertBigIntFields(menu);
  }

  async create(data: any, userId?: number) {
    const payload = this.preparePayload(data);
    if (userId) payload.created_user_id = BigInt(userId);

    if (payload.code) {
      const exists = await this.menuRepo.findByCode(payload.code);
      if (exists) throw new BadRequestException('Menu code already exists');
    }

    const menu = await this.menuRepo.create(payload);
    return this.getOne(Number(menu.id));
  }

  async createWithUser(data: any, userId?: number) {
    return this.create(data, userId);
  }

  async update(id: number, data: any, userId?: number) {
    const current = await this.menuRepo.findById(id);
    if (!current) throw new NotFoundException('Menu not found');

    const payload = this.preparePayload(data);
    if (userId) payload.updated_user_id = BigInt(userId);

    if (payload.code && payload.code !== (current as any).code) {
      const exists = await this.menuRepo.findByCode(payload.code);
      if (exists) throw new BadRequestException('Menu code already exists');
    }

    await this.menuRepo.update(id, payload);
    return this.getOne(id);
  }

  async updateById(id: number, data: any, userId?: number) {
    return this.update(id, data, userId);
  }

  async delete(id: number) {
    return this.menuRepo.delete(id);
  }

  async deleteById(id: number) {
    return this.delete(id);
  }

  async getTree(): Promise<MenuTreeItem[]> {
    const menus = await this.menuRepo.findAllWithChildren();
    return this.buildTree(menus);
  }

  async getUserMenus(
    userId: number,
    options?: { include_inactive?: boolean; flatten?: boolean; contextId?: number }
  ): Promise<MenuTreeItem[]> {
    const includeInactive = options?.include_inactive || false;
    const flatten = options?.flatten || false;
    const groupId = RequestContext.get<number | null>('groupId');
    const contextType = RequestContext.get<any>('context')?.type || 'system';

    const filter: MenuFilter = {
      status: includeInactive ? undefined : BasicStatus.active
    };

    // We use findAllWithChildren here to get everything with relations
    const menus = (await this.menuRepo.findAllWithChildren(filter) as any[]).filter(m => (m as any).show_in_menu);

    if (!menus.length) return [];

    const allPerms = new Set<string>();
    const testPerms = menus
      .filter((m: any) => m.required_permission?.code || m.menu_permissions?.length)
      .flatMap((m: any) => [
        ...(m.required_permission?.code ? [m.required_permission.code] : []),
        ...(m.menu_permissions?.map((mp: any) => mp.permission?.code).filter(Boolean) || []),
      ]);

    for (const perm of new Set(testPerms)) {
      const hasPerm = await this.rbacService.userHasPermissionsInGroup(userId, groupId ?? null, [perm as string]);
      if (hasPerm) allPerms.add(perm as string);
    }

    let filteredMenus = menus.filter((menu: any) => {
      if (menu.is_public) return true;
      if (!menu.required_permission_id && !menu.required_permission) return true;
      if (menu.required_permission?.code && allPerms.has(menu.required_permission.code)) return true;
      if (menu.menu_permissions?.length) {
        return menu.menu_permissions.some((mp: any) => mp.permission?.code && allPerms.has(mp.permission.code));
      }
      return false;
    });

    if (contextType !== 'system') {
      const systemOnlyPermissions = ['role.manage', 'permission.manage', 'group.manage', 'system.manage', 'config.manage'];
      const systemOnlyMenuCodes = ['roles', 'permissions', 'groups', 'contexts', 'config-general', 'config-email', 'rbac-management', 'config-management'];

      filteredMenus = filteredMenus.filter((menu: any) => {
        if (menu.required_permission?.code && systemOnlyPermissions.includes(menu.required_permission.code as string)) return false;
        if (systemOnlyMenuCodes.includes(menu.code as string)) return false;
        return true;
      });
    }

    const tree = this.buildTree(filteredMenus);
    return flatten ? this.flattenTree(tree) : tree;
  }

  private preparePayload(data: any): any {
    const payload = { ...data };
    if (payload.parent_id !== undefined) payload.parent_id = this.toBigInt(payload.parent_id);
    if (payload.required_permission_id !== undefined) payload.required_permission_id = this.toBigInt(payload.required_permission_id);
    return payload;
  }

  private toBigInt(value?: any): bigint | null {
    if (value === null || value === undefined || value === '') return null;
    return BigInt(value);
  }

  private buildTree(menus: any[]): MenuTreeItem[] {
    const menuMap = new Map<number, MenuTreeItem>();
    const rootMenus: MenuTreeItem[] = [];

    menus.forEach((menu: any) => {
      const menuId = Number(menu.id);
      menuMap.set(menuId, {
        id: menuId,
        code: menu.code as string,
        name: menu.name as string,
        path: menu.path as string | null,
        icon: menu.icon as string | null,
        type: menu.type as string,
        status: menu.status as string,
        children: [],
        allowed: true,
      });
    });

    menus.forEach((menu: any) => {
      const menuId = Number(menu.id);
      const item = menuMap.get(menuId)!;
      const parentId = menu.parent_id ? Number(menu.parent_id) : null;
      if (parentId && menuMap.has(parentId)) {
        menuMap.get(parentId)!.children!.push(item);
      } else {
        rootMenus.push(item);
      }
    });

    const sortTree = (items: MenuTreeItem[]) => {
      items.sort((a, b) => {
        const menuA = menus.find((m: any) => Number(m.id) === a.id);
        const menuB = menus.find((m: any) => Number(m.id) === b.id);
        return (menuA?.sort_order || 0) - (menuB?.sort_order || 0);
      });
      items.forEach(item => item.children && sortTree(item.children));
    };

    sortTree(rootMenus);
    return rootMenus;
  }

  private flattenTree(tree: MenuTreeItem[]): MenuTreeItem[] {
    const result: MenuTreeItem[] = [];
    const traverse = (items: MenuTreeItem[]) => {
      items.forEach(item => {
        result.push({ ...item, children: undefined });
        if (item.children?.length) traverse(item.children);
      });
    };
    traverse(tree);
    return result;
  }

  private convertBigIntFields(entity: any): any {
    if (!entity) return entity;
    const converted = { ...entity };
    if (converted.id) converted.id = Number(converted.id);
    if (converted.parent_id) converted.parent_id = Number(converted.parent_id);
    if (converted.required_permission_id) converted.required_permission_id = Number(converted.required_permission_id);
    if (converted.created_user_id) converted.created_user_id = Number(converted.created_user_id);
    if (converted.updated_user_id) converted.updated_user_id = Number(converted.updated_user_id);

    if (converted.parent) converted.parent = this.convertBigIntFields(converted.parent);

    if (converted.menu_permissions) {
      converted.menu_permissions = converted.menu_permissions.map((mp: any) => ({
        ...mp,
        id: mp.id ? Number(mp.id) : mp.id,
        menu_id: mp.menu_id ? Number(mp.menu_id) : mp.menu_id,
        permission_id: mp.permission_id ? Number(mp.permission_id) : mp.permission_id,
      }));
    }
    return converted;
  }
}
