import { Injectable } from '@nestjs/common';
import { Banner as PrismaBanner, BannerLocation as PrismaLocation } from '@prisma/client';
import { Banner, BannerLocation } from '@/domain/models/banner.model';
import { Status } from '@/domain/value-objects/status.vo';
import { IMapper } from '../../mapper.interface';

@Injectable()
export class BannerLocationMapper implements IMapper<BannerLocation, PrismaLocation> {
    toDomain(raw: PrismaLocation): BannerLocation {
        return BannerLocation.create(raw.id, {
            code: raw.code,
            name: raw.name,
            description: raw.description || undefined,
            status: Status.fromString(raw.status),
            createdAt: raw.created_at,
            updatedAt: raw.updated_at,
            deletedAt: raw.deleted_at || undefined,
        });
    }
    toPersistence(domain: BannerLocation): Partial<PrismaLocation> {
        const obj = domain.toObject();
        return {
            id: domain.id,
            code: obj.code,
            name: obj.name,
            description: obj.description || null,
            status: obj.status as any,
            created_at: obj.createdAt,
            updated_at: obj.updatedAt,
            deleted_at: obj.deletedAt ? new Date(obj.deletedAt) : null,
        };
    }
}

@Injectable()
export class BannerMapper implements IMapper<Banner, PrismaBanner> {
    toDomain(raw: PrismaBanner): Banner {
        return Banner.create(raw.id, {
            title: raw.title,
            subtitle: raw.subtitle || undefined,
            image: raw.image,
            mobileImage: raw.mobile_image || undefined,
            link: raw.link || undefined,
            linkTarget: raw.link_target,
            description: raw.description || undefined,
            buttonText: raw.button_text || undefined,
            buttonColor: raw.button_color || undefined,
            textColor: raw.text_color || undefined,
            locationId: raw.location_id,
            sortOrder: raw.sort_order,
            status: Status.fromString(raw.status),
            startDate: raw.start_date || undefined,
            endDate: raw.end_date || undefined,
            createdAt: raw.created_at,
            updatedAt: raw.updated_at,
            deletedAt: raw.deleted_at || undefined,
        });
    }
    toPersistence(domain: Banner): Partial<PrismaBanner> {
        const obj = domain.toObject();
        return {
            id: domain.id,
            title: obj.title,
            subtitle: obj.subtitle || null,
            image: obj.image,
            mobile_image: obj.mobileImage || null,
            link: obj.link || null,
            link_target: obj.linkTarget,
            description: obj.description || null,
            button_text: obj.buttonText || null,
            button_color: obj.buttonColor || null,
            text_color: obj.textColor || null,
            location_id: BigInt(obj.locationId),
            sort_order: obj.sortOrder,
            status: obj.status as any,
            start_date: obj.startDate ? new Date(obj.startDate) : null,
            end_date: obj.endDate ? new Date(obj.endDate) : null,
            created_at: obj.createdAt,
            updated_at: obj.updatedAt,
            deleted_at: obj.deletedAt ? new Date(obj.deletedAt) : null,
        };
    }
}
