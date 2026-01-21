import { Injectable, Inject } from '@nestjs/common';
import { IProjectRepository } from '@/domain/repositories/project.repository.interface';
import { AdminProjectResponseDto } from './admin-project.response.dto';

@Injectable()
export class ListProjectsUseCase {
    constructor(
        @Inject('IProjectRepository')
        private readonly projectRepo: IProjectRepository,
    ) { }

    async execute(): Promise<AdminProjectResponseDto[]> {
        const list = await this.projectRepo.findAll();
        return list.map(item => AdminProjectResponseDto.fromDomain(item));
    }
}
