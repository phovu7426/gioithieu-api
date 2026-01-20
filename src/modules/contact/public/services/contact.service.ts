import { Injectable, Inject } from '@nestjs/common';
import { IContactRepository, CONTACT_REPOSITORY } from '@/modules/contact/repositories/contact.repository.interface';
import { ContactStatus } from '@/shared/enums/types/contact-status.enum';
import { CreateContactDto } from '@/modules/contact/public/dtos/create-contact.dto';

@Injectable()
export class PublicContactService {
  constructor(
    @Inject(CONTACT_REPOSITORY)
    private readonly contactRepo: IContactRepository,
  ) { }

  /**
   * Tạo contact mới từ public
   */
  async create(createContactDto: CreateContactDto) {
    const contact = await this.contactRepo.create({
      name: createContactDto.name,
      email: createContactDto.email,
      phone: createContactDto.phone ?? null,
      subject: createContactDto.subject ?? null,
      message: createContactDto.message,
      status: ContactStatus.Pending as any,
    });

    return {
      ...contact,
      id: Number(contact.id)
    };
  }
}

