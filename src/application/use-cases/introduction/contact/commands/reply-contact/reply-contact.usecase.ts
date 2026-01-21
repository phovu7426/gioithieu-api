import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IContactRepository } from '@/domain/repositories/intro-extended.repository.interface';
import { AdminContactResponseDto } from '../../queries/admin/admin-contact.response.dto';

@Injectable()
export class ReplyToContactUseCase {
    constructor(
        @Inject('IContactRepository')
        private readonly contactRepo: IContactRepository,
    ) { }

    async execute(id: bigint, reply: string): Promise<AdminContactResponseDto> {
        const contact = await this.contactRepo.findById(id);
        if (!contact) {
            throw new NotFoundException(`Contact with ID ${id} not found`);
        }

        contact.replyTo(reply);
        const updated = await this.contactRepo.update(contact);
        return AdminContactResponseDto.fromDomain(updated);
    }
}
