
import { Faq } from '@prisma/client';
import { IRepository } from '@/common/base/repository/repository.interface';

export const FAQ_REPOSITORY = 'IFaqRepository';

export interface FaqFilter {
    search?: string;
    status?: string;
}

export interface IFaqRepository extends IRepository<Faq> {
    incrementViewCount(id: number): Promise<Faq>;
    incrementHelpfulCount(id: number): Promise<Faq>;
}
