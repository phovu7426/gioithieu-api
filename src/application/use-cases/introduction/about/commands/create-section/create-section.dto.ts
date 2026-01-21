export class CreateAboutSectionDto {
    title: string;
    slug: string;
    content: string;
    image?: string;
    sectionType: string;
    status: string;
    sortOrder: number;
}
