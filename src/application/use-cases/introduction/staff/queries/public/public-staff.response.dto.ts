import { Staff } from '@/domain/models/staff.model';

export class PublicStaffResponseDto {
    id: string;
    name: string;
    position: string;
    department?: string;
    bio?: string;
    avatar?: string;
    socialLinks?: any;
    experience?: number;
    expertise?: string;

    static fromDomain(staff: Staff): PublicStaffResponseDto {
        const obj = staff.toObject();
        return {
            id: obj.id.toString(),
            name: obj.name,
            position: obj.position,
            department: obj.department,
            bio: obj.bio,
            avatar: obj.avatar,
            socialLinks: obj.socialLinks,
            experience: obj.experience,
            expertise: obj.expertise,
        };
    }
}
