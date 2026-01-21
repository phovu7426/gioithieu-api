export class CreateStaffDto {
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
    status?: string;
    sortOrder?: number;
}
