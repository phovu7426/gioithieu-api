import { Partner } from '@/domain/models/partner.model';

export class AdminPartnerResponseDto {
    id: string;
    name: string;
    logo: string;
    website?: string;
    description?: string;
    type: string;
    status: string;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;

    static fromDomain(partner: Partner): AdminPartnerResponseDto {
        const obj = partner.toObject();
        return {
            ...obj,
            id: obj.id.toString(),
            createdAt: obj.createdAt.toISOString(),
            updatedAt: obj.updatedAt.toISOString(),
        };
    }
}
