import { Staff } from '@/domain/models/staff.model';

export class AdminStaffResponseDto {
    id: string;
    name: string;
    position: string;
    department?: string;
    bio?: string;
    avatar?: string;
    email?: string;
    phone?: string;
    socialLinks?: any;
    experience?: number;
    expertise?: string;
    status: string;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;

    static fromDomain(staff: Staff): AdminStaffResponseDto {
        const obj = staff.toObject();
        return {
            ...obj,
            id: obj.id.toString(),
            createdAt: obj.createdAt.toISOString(),
            updatedAt: obj.updatedAt.toISOString(),
            deletedAt: obj.deletedAt ? obj.deletedAt.toISOString() : undefined,
        };
    }
}
