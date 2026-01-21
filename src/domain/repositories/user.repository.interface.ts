import { IBaseRepository } from '@/common/base/repository/base.repository.interface';
import { User } from '@/domain/models/user.model';
import { Email } from '@/domain/value-objects';

export interface IUserRepository extends IBaseRepository<User, bigint> {
    findByEmail(email: Email): Promise<User | null>;
    existsByEmail(email: Email): Promise<boolean>;
}
