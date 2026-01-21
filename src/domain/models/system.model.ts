import { AggregateRoot } from '@/common/base/domain/aggregate-root.base';
import { Status } from '@/domain/value-objects/status.vo';

export interface IGeneralConfigProps {
    siteName: string;
    siteDescription?: string;
    siteLogo?: string;
    siteFavicon?: string;
    siteEmail?: string;
    sitePhone?: string;
    siteAddress?: string;
    siteCopyright?: string;
    timezone: string;
    locale: string;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
}

export class GeneralConfig extends AggregateRoot<bigint> {
    private props: IGeneralConfigProps;
    private constructor(id: bigint, props: IGeneralConfigProps) { super(id); this.props = props; }
    static create(id: bigint, props: IGeneralConfigProps) { return new GeneralConfig(id, props); }
    toObject() { return { id: this.id, ...this.props }; }
}

export interface IEmailConfigProps {
    smtpHost: string;
    smtpPort: number;
    smtpSecure: boolean;
    smtpUsername: string;
    smtpPassword?: string;
    fromEmail: string;
    fromName: string;
    replyToEmail?: string;
    createdAt: Date;
    updatedAt: Date;
}

export class EmailConfig extends AggregateRoot<bigint> {
    private props: IEmailConfigProps;
    private constructor(id: bigint, props: IEmailConfigProps) { super(id); this.props = props; }
    static create(id: bigint, props: IEmailConfigProps) { return new EmailConfig(id, props); }
    toObject() { return { id: this.id, ...this.props }; }
}

export interface IMenuProps {
    id: bigint;
    code: string;
    name: string;
    path?: string;
    apiPath?: string;
    icon?: string;
    type: string;
    status: string;
    parentId?: bigint;
    sortOrder: number;
    isPublic: boolean;
    showInMenu: boolean;
    requiredPermissionId?: bigint;
    createdAt: Date;
    updatedAt: Date;
}

export class Menu extends AggregateRoot<bigint> {
    private props: IMenuProps;
    private constructor(id: bigint, props: IMenuProps) { super(id); this.props = props; }
    static create(id: bigint, props: IMenuProps) { return new Menu(id, props); }
    toObject() {
        return {
            ...this.props,
            id: this.id,
            parentId: this.props.parentId?.toString(),
            requiredPermissionId: this.props.requiredPermissionId?.toString()
        };
    }
}

export interface INotificationProps {
    userId: bigint;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    readAt?: Date;
    createdAt: Date;
}

export class Notification extends AggregateRoot<bigint> {
    private props: INotificationProps;
    private constructor(id: bigint, props: INotificationProps) { super(id); this.props = props; }
    static create(id: bigint, props: INotificationProps) { return new Notification(id, props); }
    toObject() { return { id: this.id, ...this.props, userId: this.props.userId.toString() }; }
}
