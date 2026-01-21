import { Injectable, Inject } from '@nestjs/common';
import { IContactRepository } from '@/domain/repositories/intro-extended.repository.interface';
import { AdminContactResponseDto } from './admin-contact.response.dto';

@Injectable()
export class ListContactsUseCase {
    constructor(
        @Inject('IContactRepository')
        private readonly contactRepo: IContactRepository,
    ) { }

    async execute(): Promise<AdminContactResponseDto[]> {
        const list = await this.contactRepo.findAll();
        return list.map(item => AdminContactResponseDto.fromDomain(item));
    }
}
