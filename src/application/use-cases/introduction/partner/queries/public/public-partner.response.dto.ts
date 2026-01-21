import { Partner } from '@/domain/models/partner.model';

export class PublicPartnerResponseDto {
    id: string;
    name: string;
    logo: string;
    website?: string;
    type: string;

    static fromDomain(partner: Partner): PublicPartnerResponseDto {
        const obj = partner.toObject();
        return {
            id: obj.id.toString(),
            name: obj.name,
            logo: obj.logo,
            website: obj.website,
            type: obj.type,
        };
    }
}
