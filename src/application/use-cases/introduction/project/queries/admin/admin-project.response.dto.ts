import { Project } from '@/domain/models/project.model';

export class AdminProjectResponseDto {
    id: string;
    name: string;
    description?: string;
    content?: string;
    imageUrl?: string;
    clientName?: string;
    completionDate?: string;
    tags?: string[];
    link?: string;
    viewCount: string;
    featured: boolean;
    status: string;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;

    static fromDomain(project: Project): AdminProjectResponseDto {
        const obj = project.toObject();
        return {
            ...obj,
            id: obj.id.toString(),
            viewCount: obj.viewCount.toString(),
            createdAt: obj.createdAt.toISOString(),
            updatedAt: obj.updatedAt.toISOString(),
        };
    }
}
