import { Injectable, Inject } from '@nestjs/common';
import { IStaffRepository, STAFF_REPOSITORY, StaffFilter } from '@/modules/introduction/staff/repositories/staff.repository.interface';

@Injectable()
export class StaffService {
  constructor(
    @Inject(STAFF_REPOSITORY)
    private readonly staffRepo: IStaffRepository,
  ) { }

  async getList(query: any) {
    const filter: StaffFilter = {};
    if (query.search) filter.search = query.search;
    if (query.status) filter.status = query.status;
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

  async getSimpleList(query: any) {
    return this.getList({
      ...query,
      limit: query.limit ?? 50,
    });
  }

  async getOne(id: number) {
    const staff = await this.staffRepo.findById(id);
    return this.transform(staff);
  }

  async create(data: any) {
    const staff = await this.staffRepo.create(data);
    return this.getOne(Number(staff.id));
  }

  async update(id: number, data: any) {
    await this.staffRepo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    return this.staffRepo.delete(id);
  }

  async changeStatus(id: number, status: string) {
    return this.update(id, { status: status as any });
  }

  async updateSortOrder(id: number, sortOrder: number) {
    return this.update(id, { sort_order: sortOrder });
  }

  private transform(staff: any) {
    if (!staff) return staff;
    const item = { ...staff };
    if (item.id) item.id = Number(item.id);
    return item;
  }
}


