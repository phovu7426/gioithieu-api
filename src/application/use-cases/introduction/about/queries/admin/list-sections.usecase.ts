import { Injectable, Inject } from '@nestjs/common';
import { IAboutSectionRepository } from '@/domain/repositories/intro-extended.repository.interface';
import { AdminAboutSectionResponseDto } from './admin-section.response.dto';

@Injectable()
export class ListAboutSectionsUseCase {
    constructor(
        @Inject('IAboutSectionRepository')
        private readonly aboutRepo: IAboutSectionRepository,
    ) { }

    async execute(): Promise<AdminAboutSectionResponseDto[]> {
        const list = await this.aboutRepo.findAll();
        return list.map(item => AdminAboutSectionResponseDto.fromDomain(item));
    }
}
