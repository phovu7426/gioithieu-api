import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IProjectRepository } from '@/domain/repositories/project.repository.interface';
import { Project } from '@/domain/models/project.model';

@Injectable()
export class ListProjectsUseCase {
    constructor(@Inject('IProjectRepository') private readonly projectRepo: IProjectRepository) { }
    async execute() {
        return (await this.projectRepo.findAll()).map(p => p.toObject());
    }
}

@Injectable()
export class GetProjectUseCase {
    constructor(@Inject('IProjectRepository') private readonly projectRepo: IProjectRepository) { }
    async execute(id: bigint) {
        const project = await this.projectRepo.findById(id);
        if (!project) throw new NotFoundException('Project not found');
        return project.toObject();
    }
}

@Injectable()
export class CreateProjectUseCase {
    constructor(@Inject('IProjectRepository') private readonly projectRepo: IProjectRepository) { }
    async execute(dto: any) {
        const project = Project.create(0n, {
            ...dto,
            viewCount: 0n,
            featured: dto.featured || false,
            sortOrder: dto.sortOrder || 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return (await this.projectRepo.save(project)).toObject();
    }
}
