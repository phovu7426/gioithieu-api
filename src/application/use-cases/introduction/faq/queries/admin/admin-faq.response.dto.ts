import { Faq } from '@/domain/models/faq.model';

export class AdminFaqResponseDto {
    id: string;
    question: string;
    answer: string;
    viewCount: string;
    helpfulCount: string;
    status: string;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;

    static fromDomain(faq: Faq): AdminFaqResponseDto {
        const obj = faq.toObject();
        return {
            ...obj,
            id: obj.id.toString(),
            viewCount: obj.viewCount.toString(),
            helpfulCount: obj.helpfulCount.toString(),
            createdAt: obj.createdAt.toISOString(),
            updatedAt: obj.updatedAt.toISOString(),
        };
    }
}
