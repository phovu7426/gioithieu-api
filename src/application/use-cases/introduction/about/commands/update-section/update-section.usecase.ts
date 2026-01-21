import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IAboutSectionRepository } from '@/domain/repositories/intro-extended.repository.interface';
import { UpdateAboutSectionDto } from './update-section.dto';
import { AdminAboutSectionResponseDto } from '../../queries/admin/admin-section.response.dto';

@Injectable()
export class UpdateAboutSectionUseCase {
    constructor(
        @Inject('IAboutSectionRepository')
        private readonly aboutRepo: IAboutSectionRepository,
    ) { }

    async execute(id: bigint, dto: UpdateAboutSectionDto): Promise<AdminAboutSectionResponseDto> {
        const section = await this.aboutRepo.findById(id);
        if (!section) {
            throw new NotFoundException(`About section with ID ${id} not found`);
        }

        section.updateDetails(dto);
        const updated = await this.aboutRepo.update(section);
        return AdminAboutSectionResponseDto.fromDomain(updated);
    }
}
