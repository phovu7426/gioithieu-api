import { Injectable, Inject } from '@nestjs/common';
import { IFaqRepository } from '@/domain/repositories/intro-group.repository.interface';
import { Faq } from '@/domain/models/faq.model';
import { Status } from '@/domain/value-objects/status.vo';
import { CreateFaqDto } from './create-faq.dto';
import { AdminFaqResponseDto } from '../../queries/admin/admin-faq.response.dto';

@Injectable()
export class CreateFaqUseCase {
    constructor(
        @Inject('IFaqRepository')
        private readonly faqRepo: IFaqRepository,
    ) { }

    async execute(dto: CreateFaqDto): Promise<AdminFaqResponseDto> {
        const faq = Faq.create(0n, {
            ...dto,
            viewCount: 0n,
            helpfulCount: 0n,
            status: Status.fromString(dto.status || 'active'),
            sortOrder: dto.sortOrder || 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const saved = await this.faqRepo.save(faq);
        return AdminFaqResponseDto.fromDomain(saved);
    }
}
