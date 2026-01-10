import { Injectable } from '@nestjs/common';
import { Prisma, Staff } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { BasicStatus } from '@/shared/enums/types/basic-status.enum';
import { PrismaListService, PrismaListBag } from '@/common/base/services/prisma/prisma-list.service';

type PublicStaffBag = PrismaListBag & {
  Model: Staff;
  Where: Prisma.StaffWhereInput;
  Select: Prisma.StaffSelect;
  Include: Record<string, never>;
  OrderBy: Prisma.StaffOrderByWithRelationInput;
};

@Injectable()
export class PublicStaffService extends PrismaListService<PublicStaffBag> {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    super(prisma.staff, ['id', 'created_at', 'sort_order'], 'id:DESC');
  }

  protected override async prepareFilters(
    filters?: Prisma.StaffWhereInput,
  ): Promise<Prisma.StaffWhereInput | true | undefined> {
    const prepared: Prisma.StaffWhereInput = {
      ...(filters || {}),
      status: BasicStatus.active as any,
      deleted_at: null,
    };
    return prepared;
  }

  protected override prepareOptions(queryOptions: any = {}) {
    const base = super.prepareOptions(queryOptions);
    const orderBy: Prisma.StaffOrderByWithRelationInput[] = queryOptions?.orderBy ?? [
      { sort_order: 'asc' },
      { created_at: 'desc' },
    ];
    return {
      ...base,
      orderBy,
    };
  }

  async findByDepartment(department: string): Promise<Staff[]> {
    const result = await this.getList(
      {
        department,
        status: BasicStatus.active as any,
      } as any,
      { limit: 100, page: 1 },
    );
    return result.data;
  }
}

