import { Injectable } from '@nestjs/common';
import { Prisma, Staff } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { PrismaCrudService, PrismaCrudBag } from '@/common/base/services/prisma/prisma-crud.service';

type AdminStaffBag = PrismaCrudBag & {
  Model: Staff;
  Where: Prisma.StaffWhereInput;
  Select: Prisma.StaffSelect;
  Include: Record<string, never>;
  OrderBy: Prisma.StaffOrderByWithRelationInput;
  Create: Prisma.StaffCreateInput;
  Update: Prisma.StaffUpdateInput;
};

@Injectable()
export class StaffService extends PrismaCrudService<AdminStaffBag> {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    super(prisma.staff, ['id', 'created_at', 'sort_order'], 'id:DESC');
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
}

