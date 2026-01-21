import { IBaseRepository } from '@/common/base/repository/base.repository.interface';
import { Staff } from '@/domain/models/staff.model';

export interface IStaffRepository extends IBaseRepository<Staff, bigint> {
    findActive(): Promise<Staff[]>;
    findByDepartment(department: string): Promise<Staff[]>;
}
