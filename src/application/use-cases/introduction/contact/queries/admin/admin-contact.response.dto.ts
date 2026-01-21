import { Contact } from '@/domain/models/intro-extended.model';

export class AdminContactResponseDto {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    status: string;
    reply?: string;
    repliedAt?: string;
    createdAt: string;

    static fromDomain(contact: Contact): AdminContactResponseDto {
        const obj = contact.toObject();
        return {
            ...obj,
            id: obj.id.toString(),
            repliedAt: obj.repliedAt?.toISOString(),
            createdAt: obj.createdAt.toISOString(),
        };
    }
}
