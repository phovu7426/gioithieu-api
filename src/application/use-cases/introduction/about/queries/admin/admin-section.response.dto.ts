import { AboutSection } from '@/domain/models/intro-extended.model';

export class AdminAboutSectionResponseDto {
    id: string;
    title: string;
    slug: string;
    content: string;
    image?: string;
    sectionType: string;
    status: string;
    sortOrder: number;
    createdAt: string;

    static fromDomain(section: AboutSection): AdminAboutSectionResponseDto {
        const obj = section.toObject();
        return {
            ...obj,
            id: obj.id.toString(),
            createdAt: obj.createdAt.toISOString(),
        };
    }
}
