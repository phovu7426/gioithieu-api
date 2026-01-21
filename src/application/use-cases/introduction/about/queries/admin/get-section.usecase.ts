import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IAboutSectionRepository } from '@/domain/repositories/intro-extended.repository.interface';
import { AdminAboutSectionResponseDto } from './admin-section.response.dto';

@Injectable()
export class GetAboutSectionUseCase {
    constructor(
        @Inject('IAboutSectionRepository')
        private readonly aboutRepo: IAboutSectionRepository,
    ) { }

    async execute(id: bigint): Promise<AdminAboutSectionResponseDto> {
        const section = await this.aboutRepo.findById(id);
        if (!section) {
            throw new NotFoundException(`About section with ID ${id} not found`);
        }
        return AdminAboutSectionResponseDto.fromDomain(section);
    }
}
