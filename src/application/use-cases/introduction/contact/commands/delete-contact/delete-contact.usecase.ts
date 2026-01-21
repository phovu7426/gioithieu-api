import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IContactRepository } from '@/domain/repositories/intro-extended.repository.interface';

@Injectable()
export class DeleteContactUseCase {
    constructor(
        @Inject('IContactRepository')
        private readonly contactRepo: IContactRepository,
    ) { }

    async execute(id: bigint): Promise<void> {
        const contact = await this.contactRepo.findById(id);
        if (!contact) {
            throw new NotFoundException(`Contact with ID ${id} not found`);
        }

        await this.contactRepo.delete(id);
    }
}
