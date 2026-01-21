import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IAboutSectionRepository } from '@/domain/repositories/intro-extended.repository.interface';
import { PublicAboutSectionResponseDto } from './public-section.response.dto';

@Injectable()
export class GetAboutSectionBySlugUseCase {
    constructor(
        @Inject('IAboutSectionRepository')
        private readonly aboutRepo: IAboutSectionRepository,
    ) { }

    async execute(slug: string): Promise<PublicAboutSectionResponseDto> {
        const section = await this.aboutRepo.findBySlug(slug);
        if (!section) {
            throw new NotFoundException(`About section with slug ${slug} not found`);
        }
        return PublicAboutSectionResponseDto.fromDomain(section);
    }
}
