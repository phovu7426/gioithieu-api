import { Injectable, Inject } from '@nestjs/common';
import { IProjectRepository } from '@/domain/repositories/project.repository.interface';
import { Project } from '@/domain/models/project.model';
import { CreateProjectDto } from './create-project.dto';
import { AdminProjectResponseDto } from '../../queries/admin/admin-project.response.dto';

@Injectable()
export class CreateProjectUseCase {
    constructor(
        @Inject('IProjectRepository')
        private readonly projectRepo: IProjectRepository,
    ) { }

    async execute(dto: CreateProjectDto): Promise<AdminProjectResponseDto> {
        const project = Project.create(0n, {
            ...dto,
            startDate: dto.startDate ? new Date(dto.startDate) : undefined,
            endDate: dto.endDate ? new Date(dto.endDate) : undefined,
            viewCount: 0n,
            featured: dto.featured || false,
            sortOrder: dto.sortOrder || 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const saved = await this.projectRepo.save(project);
        return AdminProjectResponseDto.fromDomain(saved);
    }
}
