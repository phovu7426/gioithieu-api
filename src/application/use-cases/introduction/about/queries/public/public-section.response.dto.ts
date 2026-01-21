import { AboutSection } from '@/domain/models/intro-extended.model';

export class PublicAboutSectionResponseDto {
    id: string;
    title: string;
    slug: string;
    content: string;
    image?: string;
    sectionType: string;

    static fromDomain(section: AboutSection): PublicAboutSectionResponseDto {
        const obj = section.toObject();
        return {
            id: obj.id.toString(),
            title: obj.title,
            slug: obj.slug,
            content: obj.content,
            image: obj.image,
            sectionType: obj.sectionType,
        };
    }
}
