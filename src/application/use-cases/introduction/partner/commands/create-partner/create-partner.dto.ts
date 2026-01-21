export class CreatePartnerDto {
    name: string;
    logo: string;
    website?: string;
    description?: string;
    type: string;
    status?: string;
    sortOrder?: number;
}
