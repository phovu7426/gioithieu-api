import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IContactRepository } from '@/domain/repositories/intro-extended.repository.interface';

@Injectable()
export class MarkContactReadUseCase {
    constructor(
        @Inject('IContactRepository')
        private readonly contactRepo: IContactRepository,
    ) { }

    async execute(id: bigint): Promise<void> {
        const contact = await this.contactRepo.findById(id);
        if (!contact) {
            throw new NotFoundException(`Contact with ID ${id} not found`);
        }

        contact.markAsRead();
        await this.contactRepo.update(contact);
    }
}
