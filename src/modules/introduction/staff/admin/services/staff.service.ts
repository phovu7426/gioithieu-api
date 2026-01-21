import { Injectable, Inject } from '@nestjs/common';
import { IStaffRepository, STAFF_REPOSITORY, StaffFilter } from '@/modules/introduction/staff/repositories/staff.repository.interface';
import { BaseContentService } from '@/common/core/services';
import { Staff } from '@prisma/client';

@Injectable()
export class StaffService extends BaseContentService<Staff, IStaffRepository> {
  constructor(
    @Inject(STAFF_REPOSITORY)
    private readonly staffRepo: IStaffRepository,
  ) {
    super(staffRepo);
  }

  protected defaultSort = 'sort_order:asc,created_at:desc';

  async getList(query: any) {
    const filter: StaffFilter = {};
    if (query.search) filter.search = query.search;
    if (query.status) filter.status = query.status;
    if (query.department) filter.department = query.department;

    return super.getList({
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      filter,
    });
  }

  async getSimpleList(query: any) {
    return this.getList({
      ...query,
      limit: query.limit ?? 50,
    });
  }
}


