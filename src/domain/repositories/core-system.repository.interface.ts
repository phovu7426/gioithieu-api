import { IBaseRepository } from '@/common/base/repository/base.repository.interface';
import { Role, Permission, Context } from '@/domain/models/rbac.model';
import { GeneralConfig, EmailConfig, Notification, Menu } from '@/domain/models/system.model';

export interface IRoleRepository extends IBaseRepository<Role, bigint> {
    findByCode(code: string): Promise<Role | null>;
}

export interface IPermissionRepository extends IBaseRepository<Permission, bigint> {
    findByCode(code: string): Promise<Permission | null>;
}

export interface IContextRepository extends IBaseRepository<Context, bigint> {
    findByCode(code: string): Promise<Context | null>;
}

export interface IGeneralConfigRepository extends IBaseRepository<GeneralConfig, bigint> {
    getLatest(): Promise<GeneralConfig | null>;
}

export interface IEmailConfigRepository extends IBaseRepository<EmailConfig, bigint> {
    getLatest(): Promise<EmailConfig | null>;
}

export interface INotificationRepository extends IBaseRepository<Notification, bigint> {
    findByUser(userId: bigint): Promise<Notification[]>;
    markAsRead(id: bigint): Promise<boolean>;
}

export interface IMenuRepository extends IBaseRepository<Menu, bigint> {
    findByCode(code: string): Promise<Menu | null>;
    findTree(): Promise<Menu[]>;
}
