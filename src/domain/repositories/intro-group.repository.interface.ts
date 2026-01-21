import { IBaseRepository } from '@/common/base/repository/base.repository.interface';
import { Gallery } from '@/domain/models/gallery.model';
import { Partner } from '@/domain/models/partner.model';
import { Faq } from '@/domain/models/faq.model';
import { Testimonial } from '@/domain/models/testimonial.model';

export interface IGalleryRepository extends IBaseRepository<Gallery, bigint> {
    findBySlug(slug: string): Promise<Gallery | null>;
    findActive(): Promise<Gallery[]>;
}

export interface IPartnerRepository extends IBaseRepository<Partner, bigint> {
    findActive(): Promise<Partner[]>;
    findByType(type: string): Promise<Partner[]>;
}

export interface IFaqRepository extends IBaseRepository<Faq, bigint> {
    findActive(): Promise<Faq[]>;
}

export interface ITestimonialRepository extends IBaseRepository<Testimonial, bigint> {
    findActive(): Promise<Testimonial[]>;
    findFeatured(limit: number): Promise<Testimonial[]>;
    findByProject(projectId: bigint): Promise<Testimonial[]>;
}
