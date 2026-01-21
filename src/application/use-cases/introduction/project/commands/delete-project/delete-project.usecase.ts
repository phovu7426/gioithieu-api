import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IProjectRepository } from '@/domain/repositories/project.repository.interface';

@Injectable()
export class DeleteProjectUseCase {
    constructor(
        @Inject('IProjectRepository')
        private readonly projectRepo: IProjectRepository,
    ) { }

    async execute(id: bigint): Promise<void> {
        const project = await this.projectRepo.findById(id);
        if (!project) {
            throw new NotFoundException(`Project with ID ${id} not found`);
        }

        project.softDelete();
        await this.projectRepo.update(project);
    }
}
