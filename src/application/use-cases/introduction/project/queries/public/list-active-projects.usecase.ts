import { Injectable, Inject } from '@nestjs/common';
import { IProjectRepository } from '@/domain/repositories/project.repository.interface';
import { PublicProjectResponseDto } from './public-project.response.dto';

@Injectable()
export class ListActiveProjectsUseCase {
    constructor(
        @Inject('IProjectRepository')
        private readonly projectRepo: IProjectRepository,
    ) { }

    async execute(): Promise<PublicProjectResponseDto[]> {
        const list = await this.projectRepo.findAll();
        return list
            .filter(item => item.toObject().status === 'active')
            .map(item => PublicProjectResponseDto.fromDomain(item));
    }
}
