import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IAboutSectionRepository } from '@/domain/repositories/intro-extended.repository.interface';

@Injectable()
export class DeleteAboutSectionUseCase {
    constructor(
        @Inject('IAboutSectionRepository')
        private readonly aboutRepo: IAboutSectionRepository,
    ) { }

    async execute(id: bigint): Promise<void> {
        const section = await this.aboutRepo.findById(id);
        if (!section) {
            throw new NotFoundException(`About section with ID ${id} not found`);
        }

        await this.aboutRepo.delete(id);
    }
}
