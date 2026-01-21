import { Injectable, Inject } from '@nestjs/common';
import { IContactRepository } from '@/domain/repositories/intro-extended.repository.interface';
import { Contact } from '@/domain/models/intro-extended.model';
import { CreateContactDto } from './create-contact.dto';
import { AdminContactResponseDto } from '../../queries/admin/admin-contact.response.dto';

@Injectable()
export class CreateContactUseCase {
    constructor(
        @Inject('IContactRepository')
        private readonly contactRepo: IContactRepository,
    ) { }

    async execute(dto: CreateContactDto): Promise<AdminContactResponseDto> {
        const contact = Contact.create(0n, {
            ...dto,
            status: 'new',
            createdAt: new Date(),
        });

        const saved = await this.contactRepo.save(contact);
        return AdminContactResponseDto.fromDomain(saved);
    }
}
