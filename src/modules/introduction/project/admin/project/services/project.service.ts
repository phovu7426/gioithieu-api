import { Injectable } from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { PrismaCrudBag } from '@/common/base/services/prisma/prisma-crud.service';
import { BaseContentService } from '@/common/base/services/prisma/base-content.service';

type AdminProjectBag = PrismaCrudBag & {
  Model: Project;
  Where: Prisma.ProjectWhereInput;
  Select: Prisma.ProjectSelect;
  Include: Prisma.ProjectInclude;
  OrderBy: Prisma.ProjectOrderByWithRelationInput;
  Create: Prisma.ProjectCreateInput;
  Update: Prisma.ProjectUpdateInput;
};

@Injectable()
export class ProjectService extends BaseContentService<AdminProjectBag> {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    super(prisma.project, ['id', 'created_at', 'sort_order'], 'id:DESC');
  }

  /**
   * Hook: Generate slug from name if not provided
   */
  protected override async beforeCreate(createDto: AdminProjectBag['Create']): Promise<AdminProjectBag['Create']> {
    const payload = { ...createDto };

    // Ensure slug is generated
    await this.ensureSlug(payload);

    // Convert images array to JSON if provided
    if (payload.images && Array.isArray(payload.images)) {
      payload.images = payload.images as any;
    }

    // Convert BigInt fields
    if (payload.area !== undefined) {
      payload.area = payload.area as any;
    }
    if (payload.budget !== undefined) {
      payload.budget = payload.budget as any;
    }

    return payload;
  }

  /**
   * Hook: Generate slug from name if not provided, check uniqueness
   */
  protected override async beforeUpdate(
    where: Prisma.ProjectWhereInput,
    updateDto: AdminProjectBag['Update'],
  ): Promise<AdminProjectBag['Update']> {
    const payload = { ...updateDto };
    const id = (where as any).id ? BigInt((where as any).id) : null;
    const current = id
      ? await this.prisma.project.findFirst({ where: { id } })
      : null;

    // Ensure slug is generated and unique
    await this.ensureSlug(payload, id ? Number(id) : undefined, current?.slug || undefined);

    // Convert images array to JSON if provided
    if (payload.images && Array.isArray(payload.images)) {
      payload.images = payload.images as any;
    }

    // Convert BigInt fields
    if (payload.area !== undefined) {
      payload.area = payload.area as any;
    }
    if (payload.budget !== undefined) {
      payload.budget = payload.budget as any;
    }

    return payload;
  }

  /**
   * Override prepareOptions để thêm sort mặc định
   */
  protected override prepareOptions(queryOptions: any = {}) {
    const base = super.prepareOptions(queryOptions);

    const orderBy: Prisma.ProjectOrderByWithRelationInput[] = queryOptions?.orderBy ?? [
      { sort_order: 'asc' },
      { created_at: 'desc' },
    ];

    return {
      ...base,
      orderBy,
    };
  }
}

