import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IProjectRepository } from '@/domain/repositories/project.repository.interface';
import { UpdateProjectDto } from './update-project.dto';
import { AdminProjectResponseDto } from '../../queries/admin/admin-project.response.dto';

@Injectable()
export class UpdateProjectUseCase {
    constructor(
        @Inject('IProjectRepository')
        private readonly projectRepo: IProjectRepository,
    ) { }

    async execute(id: bigint, dto: UpdateProjectDto): Promise<AdminProjectResponseDto> {
        const project = await this.projectRepo.findById(id);
        if (!project) {
            throw new NotFoundException(`Project with ID ${id} not found`);
        }

        const updateData: any = { ...dto };
        if (dto.startDate) updateData.startDate = new Date(dto.startDate);
        if (dto.endDate) updateData.endDate = new Date(dto.endDate);

        project.updateDetails(updateData);
        const updated = await this.projectRepo.update(project);
        return AdminProjectResponseDto.fromDomain(updated);
    }
}
