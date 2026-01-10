import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { ProjectStatus } from '@/shared/enums/types/project-status.enum';
import { PrismaCrudService, PrismaCrudBag } from '@/common/base/services/prisma/prisma-crud.service';
import { StringUtil } from '@/core/utils/string.util';

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
export class ProjectService extends PrismaCrudService<AdminProjectBag> {
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
   * Ensure slug is generated from name if not provided, and check uniqueness
   */
  private async ensureSlug(data: any, excludeId?: number, currentSlug?: string): Promise<void> {
    // If no slug but has name → generate from name
    if (data.name && !data.slug) {
      data.slug = StringUtil.toSlug(data.name);
      return;
    }

    // If has slug → check uniqueness
    if (data.slug) {
      const normalizedSlug = StringUtil.toSlug(data.slug);
      const normalizedCurrentSlug = currentSlug ? StringUtil.toSlug(currentSlug) : null;

      // If slug unchanged, don't update it
      if (normalizedCurrentSlug && normalizedSlug === normalizedCurrentSlug) {
        delete data.slug;
        return;
      }

      // Check if slug already exists
      const existing = await this.prisma.project.findFirst({
        where: {
          slug: normalizedSlug,
          deleted_at: null,
          ...(excludeId ? { id: { not: BigInt(excludeId) } } : {}),
        },
      });

      if (existing) {
        // Generate unique slug by appending number
        let counter = 1;
        let uniqueSlug = `${normalizedSlug}-${counter}`;
        while (await this.prisma.project.findFirst({
          where: { slug: uniqueSlug, deleted_at: null },
        })) {
          counter++;
          uniqueSlug = `${normalizedSlug}-${counter}`;
        }
        data.slug = uniqueSlug;
      } else {
        data.slug = normalizedSlug;
      }
    }
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

  /**
   * Thay đổi trạng thái project
   */
  async changeStatus(id: number, status: ProjectStatus) {
    return this.update({ id: BigInt(id) } as any, { status: status as any } as any);
  }

  /**
   * Toggle featured status
   */
  async toggleFeatured(id: number, featured: boolean) {
    return this.update({ id: BigInt(id) } as any, { featured } as any);
  }

  /**
   * Cập nhật thứ tự sắp xếp project
   */
  async updateSortOrder(id: number, sortOrder: number) {
    return this.update({ id: BigInt(id) } as any, { sort_order: sortOrder } as any);
  }

  /**
   * Increment view count
   */
  async incrementViewCount(id: number) {
    const project = await this.prisma.project.findFirst({
      where: { id: BigInt(id) },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return this.prisma.project.update({
      where: { id: BigInt(id) },
      data: { view_count: { increment: 1 } },
    });
  }
}

