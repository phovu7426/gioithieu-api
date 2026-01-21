import { Project } from '@/domain/models/project.model';

export class PublicProjectResponseDto {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    completionDate?: string;
    tags?: string[];
    link?: string;
    viewCount: string;

    static fromDomain(project: Project): PublicProjectResponseDto {
        const obj = project.toObject();
        return {
            id: obj.id.toString(),
            name: obj.name,
            description: obj.description,
            imageUrl: obj.imageUrl,
            completionDate: obj.completionDate,
            tags: obj.tags,
            link: obj.link,
            viewCount: obj.viewCount.toString(),
        };
    }
}
