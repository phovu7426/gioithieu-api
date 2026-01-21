import { Injectable, Inject } from '@nestjs/common';
import { IAboutSectionRepository } from '@/domain/repositories/intro-extended.repository.interface';
import { PublicAboutSectionResponseDto } from './public-section.response.dto';

@Injectable()
export class ListActiveAboutSectionsUseCase {
    constructor(
        @Inject('IAboutSectionRepository')
        private readonly aboutRepo: IAboutSectionRepository,
    ) { }

    async execute(): Promise<PublicAboutSectionResponseDto[]> {
        const list = await this.aboutRepo.findActive();
        return list.map(item => PublicAboutSectionResponseDto.fromDomain(item));
    }
}
