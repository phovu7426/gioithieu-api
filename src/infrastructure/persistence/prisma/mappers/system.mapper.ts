import { Injectable } from '@nestjs/common';
import { GeneralConfig as PrismaGeneral, Notification as PrismaNotification, EmailConfig as PrismaEmail, Menu as PrismaMenu } from '@prisma/client';
import { GeneralConfig, Notification, EmailConfig, Menu } from '@/domain/models/system.model';
import { IMapper } from '../../mapper.interface';

@Injectable()
export class SystemMapper implements IMapper<GeneralConfig, PrismaGeneral> {
    toDomain(raw: PrismaGeneral): GeneralConfig {
        return GeneralConfig.create(raw.id, {
            siteName: raw.site_name, siteDescription: raw.site_description || undefined,
            siteLogo: raw.site_logo || undefined, siteFavicon: raw.site_favicon || undefined,
            siteEmail: raw.site_email || undefined, sitePhone: raw.site_phone || undefined,
            siteAddress: raw.site_address || undefined, siteCopyright: raw.site_copyright || undefined,
            timezone: raw.timezone, locale: raw.locale, currency: raw.currency,
            createdAt: raw.created_at, updatedAt: raw.updated_at
        });
    }
    toPersistence(domain: GeneralConfig): Partial<PrismaGeneral> {
        const obj = domain.toObject();
        return {
            id: domain.id, site_name: obj.siteName, site_description: obj.siteDescription || null,
            site_logo: obj.siteLogo || null, site_favicon: obj.siteFavicon || null,
            site_email: obj.siteEmail || null, site_phone: obj.sitePhone || null,
            site_address: obj.siteAddress || null, site_copyright: obj.siteCopyright || null,
            timezone: obj.timezone, locale: obj.locale, currency: obj.currency,
            created_at: obj.createdAt, updated_at: obj.updatedAt
        };
    }
}

@Injectable()
export class EmailConfigMapper implements IMapper<EmailConfig, PrismaEmail> {
    toDomain(raw: PrismaEmail): EmailConfig {
        return EmailConfig.create(raw.id, {
            smtpHost: raw.smtp_host, smtpPort: raw.smtp_port, smtpSecure: raw.smtp_secure,
            smtpUsername: raw.smtp_username, smtpPassword: raw.smtp_password,
            fromEmail: raw.from_email, fromName: raw.from_name,
            replyToEmail: raw.reply_to_email || undefined,
            createdAt: raw.created_at, updatedAt: raw.updated_at
        });
    }
    toPersistence(domain: EmailConfig): Partial<PrismaEmail> {
        const obj = domain.toObject();
        return {
            id: domain.id, smtp_host: obj.smtpHost, smtp_port: obj.smtpPort, smtp_secure: obj.smtpSecure,
            smtp_username: obj.smtpUsername, smtp_password: obj.smtpPassword,
            from_email: obj.fromEmail, from_name: obj.fromName, reply_to_email: obj.replyToEmail || null,
            created_at: obj.createdAt, updated_at: obj.updatedAt
        };
    }
}

@Injectable()
export class MenuMapper implements IMapper<Menu, PrismaMenu> {
    toDomain(raw: PrismaMenu): Menu {
        return Menu.create(raw.id, {
            id: raw.id, code: raw.code, name: raw.name, path: raw.path || undefined,
            apiPath: raw.api_path || undefined, icon: raw.icon || undefined,
            type: raw.type, status: raw.status, parentId: raw.parent_id || undefined,
            sortOrder: raw.sort_order, isPublic: raw.is_public, showInMenu: raw.show_in_menu,
            requiredPermissionId: raw.required_permission_id || undefined,
            createdAt: raw.created_at, updatedAt: raw.updated_at
        });
    }
    toPersistence(domain: Menu): Partial<PrismaMenu> {
        const obj = domain.toObject();
        return {
            id: domain.id, code: obj.code, name: obj.name, path: obj.path || null,
            api_path: obj.apiPath || null, icon: obj.icon || null,
            type: obj.type as any, status: obj.status as any,
            parent_id: obj.parentId ? BigInt(obj.parentId) : null,
            sort_order: obj.sortOrder, is_public: obj.isPublic, show_in_menu: obj.showInMenu,
            required_permission_id: obj.requiredPermissionId ? BigInt(obj.requiredPermissionId) : null,
            created_at: obj.createdAt, updated_at: obj.updatedAt
        };
    }
}

@Injectable()
export class NotificationMapper implements IMapper<Notification, PrismaNotification> {
    toDomain(raw: PrismaNotification): Notification {
        return Notification.create(raw.id, {
            userId: raw.user_id, title: raw.title, message: raw.message,
            type: raw.type, isRead: raw.is_read, readAt: raw.read_at || undefined,
            createdAt: raw.created_at
        });
    }
    toPersistence(domain: Notification): Partial<PrismaNotification> {
        const obj = domain.toObject();
        return {
            id: domain.id, user_id: BigInt(obj.userId), title: obj.title,
            message: obj.message, type: obj.type as any, is_read: obj.isRead,
            read_at: obj.readAt || null, created_at: obj.createdAt
        };
    }
}
