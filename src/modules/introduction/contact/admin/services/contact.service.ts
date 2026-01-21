import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IContactRepository, CONTACT_REPOSITORY, ContactFilter } from '@/modules/introduction/contact/repositories/contact.repository.interface';
import { ContactStatus } from '@/shared/enums/types/contact-status.enum';

@Injectable()
export class ContactService {
  constructor(
    @Inject(CONTACT_REPOSITORY)
    private readonly contactRepo: IContactRepository,
  ) { }

  async getList(query: any) {
    const filter: ContactFilter = {};
    if (query.search) filter.search = query.search;
    if (query.status) filter.status = query.status;

    const result = await this.contactRepo.findAll({
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      filter,
    });

    result.data = result.data.map(item => this.transform(item));
    return result;
  }

  async getSimpleList(query: any) {
    return this.getList({
      ...query,
      limit: query.limit ?? 50,
    });
  }

  async getOne(id: number) {
    const contact = await this.contactRepo.findById(id);
    return this.transform(contact);
  }

  async create(data: any) {
    const contact = await this.contactRepo.create(data);
    return this.getOne(Number(contact.id));
  }

  async update(id: number, data: any) {
    await this.contactRepo.update(id, data);
    return this.getOne(id);
  }

  async replyToContact(id: number, reply: string, repliedBy?: number) {
    const data = {
      reply,
      status: ContactStatus.Replied as any,
      replied_at: new Date(),
      replied_by: repliedBy ? BigInt(repliedBy) : null,
    };
    return this.contactRepo.update(id, data);
  }

  async markAsRead(id: number) {
    const contact = await this.contactRepo.findById(id);
    if (contact && (contact as any).status === ContactStatus.Pending) {
      return this.contactRepo.update(id, { status: ContactStatus.Read as any });
    }
    return contact;
  }

  async closeContact(id: number) {
    return this.contactRepo.update(id, { status: ContactStatus.Closed as any });
  }

  async delete(id: number) {
    return this.contactRepo.delete(id);
  }

  private transform(contact: any) {
    if (!contact) return contact;
    const item = { ...contact };
    if (item.id) item.id = Number(item.id);
    if (item.replied_by) item.replied_by = Number(item.replied_by);
    return item;
  }
}

