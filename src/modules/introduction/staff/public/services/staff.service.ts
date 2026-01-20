import { Injectable, Inject } from '@nestjs/common';
import { IStaffRepository, STAFF_REPOSITORY, StaffFilter } from '@/modules/introduction/staff/repositories/staff.repository.interface';
import { BasicStatus } from '@/shared/enums/types/basic-status.enum';

@Injectable()
export class PublicStaffService {
  constructor(
    @Inject(STAFF_REPOSITORY)
    private readonly staffRepo: IStaffRepository,
  ) { }

  async getList(query: any) {
    const filter: StaffFilter = {
      status: BasicStatus.active
    };
    if (query.search) filter.search = query.search;
    if (query.department) filter.department = query.department;

    const result = await this.staffRepo.findAll({
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      filter,
    });

    result.data = result.data.map(item => this.transform(item));
    return result;
  }

  async findByDepartment(department: string) {
    const result = await this.getList({ department, limit: 100, page: 1 } as any);
    return result.data;
  }

  async getOne(id: number) {
    const staff = await this.staffRepo.findById(id);
    if (!staff || (staff as any).status !== BasicStatus.active) return null;
    return this.transform(staff);
  }

  private transform(staff: any) {
    if (!staff) return staff;
    const item = { ...staff };
    if (item.id) item.id = Number(item.id);
    return item;
  }
}

