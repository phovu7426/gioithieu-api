import { Faq } from '@/domain/models/faq.model';

export class PublicFaqResponseDto {
    id: string;
    question: string;
    answer: string;
    viewCount: string;
    helpfulCount: string;

    static fromDomain(faq: Faq): PublicFaqResponseDto {
        const obj = faq.toObject();
        return {
            id: obj.id.toString(),
            question: obj.question,
            answer: obj.answer,
            viewCount: obj.viewCount,
            helpfulCount: obj.helpfulCount,
        };
    }
}
