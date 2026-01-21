import { Injectable, Inject } from '@nestjs/common';
import { IAboutSectionRepository } from '@/domain/repositories/intro-extended.repository.interface';
import { AboutSection } from '@/domain/models/intro-extended.model';
import { CreateAboutSectionDto } from './create-section.dto';
import { AdminAboutSectionResponseDto } from '../../queries/admin/admin-section.response.dto';

@Injectable()
export class CreateAboutSectionUseCase {
    constructor(
        @Inject('IAboutSectionRepository')
        private readonly aboutRepo: IAboutSectionRepository,
    ) { }

    async execute(dto: CreateAboutSectionDto): Promise<AdminAboutSectionResponseDto> {
        const section = AboutSection.create(0n, {
            ...dto,
            createdAt: new Date(),
        });

        const saved = await this.aboutRepo.save(section);
        return AdminAboutSectionResponseDto.fromDomain(saved);
    }
}
