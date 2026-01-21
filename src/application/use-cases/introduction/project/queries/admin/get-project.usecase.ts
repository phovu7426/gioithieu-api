import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IProjectRepository } from '@/domain/repositories/project.repository.interface';
import { AdminProjectResponseDto } from './admin-project.response.dto';

@Injectable()
export class GetProjectUseCase {
    constructor(
        @Inject('IProjectRepository')
        private readonly projectRepo: IProjectRepository,
    ) { }

    async execute(id: bigint): Promise<AdminProjectResponseDto> {
        const project = await this.projectRepo.findById(id);
        if (!project) {
            throw new NotFoundException(`Project with ID ${id} not found`);
        }
        return AdminProjectResponseDto.fromDomain(project);
    }
}
