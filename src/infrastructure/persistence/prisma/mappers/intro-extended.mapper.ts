import { Injectable } from '@nestjs/common';
import { Contact as PrismaContact, AboutSection as PrismaAbout } from '@prisma/client';
import { Contact, AboutSection } from '@/domain/models/intro-extended.model';
import { IMapper } from '../../mapper.interface';

@Injectable()
export class ContactMapper implements IMapper<Contact, PrismaContact> {
    toDomain(raw: PrismaContact): Contact {
        return Contact.create(raw.id, {
            name: raw.name, email: raw.email, phone: raw.phone || undefined,
            subject: raw.subject || undefined, message: raw.message, status: raw.status,
            reply: raw.reply || undefined, repliedAt: raw.replied_at || undefined,
            createdAt: raw.created_at
        });
    }
    toPersistence(domain: Contact): Partial<PrismaContact> {
        const obj = domain.toObject();
        return {
            id: domain.id, name: obj.name, email: obj.email, phone: obj.phone || null,
            subject: obj.subject || null, message: obj.message, status: obj.status,
            reply: obj.reply || null, replied_at: obj.repliedAt || null,
            created_at: obj.createdAt
        };
    }
}

@Injectable()
export class AboutSectionMapper implements IMapper<AboutSection, PrismaAbout> {
    toDomain(raw: PrismaAbout): AboutSection {
        return AboutSection.create(raw.id, {
            title: raw.title, slug: raw.slug, content: raw.content,
            image: raw.image || undefined, sectionType: raw.section_type,
            status: raw.status, sortOrder: raw.sort_order, createdAt: raw.created_at
        });
    }
    toPersistence(domain: AboutSection): Partial<PrismaAbout> {
        const obj = domain.toObject();
        return {
            id: domain.id, title: obj.title, slug: obj.slug, content: obj.content,
            image: obj.image || null, section_type: obj.sectionType as any,
            status: obj.status as any, sort_order: obj.sortOrder, created_at: obj.createdAt
        };
    }
}
