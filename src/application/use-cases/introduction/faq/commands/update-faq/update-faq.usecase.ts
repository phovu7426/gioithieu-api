import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IFaqRepository } from '@/domain/repositories/intro-group.repository.interface';
import { Status } from '@/domain/value-objects/status.vo';
import { UpdateFaqDto } from './update-faq.dto';
import { AdminFaqResponseDto } from '../../queries/admin/admin-faq.response.dto';

@Injectable()
export class UpdateFaqUseCase {
    constructor(
        @Inject('IFaqRepository')
        private readonly faqRepo: IFaqRepository,
    ) { }

    async execute(id: bigint, dto: UpdateFaqDto): Promise<AdminFaqResponseDto> {
        const faq = await this.faqRepo.findById(id);
        if (!faq) {
            throw new NotFoundException(`FAQ with ID ${id} not found`);
        }

        const updateData: any = { ...dto };
        if (dto.status) {
            updateData.status = Status.fromString(dto.status);
        }

        faq.updateDetails(updateData);
        const updated = await this.faqRepo.update(faq);
        return AdminFaqResponseDto.fromDomain(updated);
    }
}
