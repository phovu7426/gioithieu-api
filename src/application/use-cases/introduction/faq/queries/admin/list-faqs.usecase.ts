import { Injectable, Inject } from '@nestjs/common';
import { IFaqRepository } from '@/domain/repositories/intro-group.repository.interface';
import { AdminFaqResponseDto } from './admin-faq.response.dto';

@Injectable()
export class ListFaqsUseCase {
    constructor(
        @Inject('IFaqRepository')
        private readonly faqRepo: IFaqRepository,
    ) { }

    async execute(): Promise<AdminFaqResponseDto[]> {
        const list = await this.faqRepo.findAll();
        return list.map(item => AdminFaqResponseDto.fromDomain(item));
    }
}
