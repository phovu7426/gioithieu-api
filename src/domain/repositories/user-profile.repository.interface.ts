import { IBaseRepository } from '@/common/base/repository/base.repository.interface';
import { Profile } from '@/domain/models/user-profile.model';

export interface IProfileRepository extends IBaseRepository<Profile, bigint> {
    findByUserId(userId: bigint): Promise<Profile | null>;
}
