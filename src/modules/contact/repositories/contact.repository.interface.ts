
import { Contact } from '@prisma/client';
import { IRepository } from '@/common/base/repository/repository.interface';

export const CONTACT_REPOSITORY = 'IContactRepository';

export interface ContactFilter {
    search?: string;
    status?: string;
}

export interface IContactRepository extends IRepository<Contact> {
}
