import { IBaseRepository } from '@/common/base/repository/base.repository.interface';
import { Contact, AboutSection } from '@/domain/models/intro-extended.model';

export interface IContactRepository extends IBaseRepository<Contact, bigint> {
    findByEmail(email: string): Promise<Contact[]>;
}

export interface IAboutSectionRepository extends IBaseRepository<AboutSection, bigint> {
    findBySlug(slug: string): Promise<AboutSection | null>;
    findByType(type: string): Promise<AboutSection[]>;
    findActive(): Promise<AboutSection[]>;
}
