import { Injectable, Inject } from '@nestjs/common';
import { IAboutSectionRepository } from '@/domain/repositories/intro-extended.repository.interface';

@Injectable()
export class GetAboutCompanyUseCase {
    constructor(@Inject('IAboutSectionRepository') private readonly repo: IAboutSectionRepository) { }
    async execute() {
        const sections = await this.repo.findAll();
        return sections.map(s => s.toObject());
    }
}
