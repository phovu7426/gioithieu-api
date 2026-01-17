import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Testimonial } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { PrismaCrudService, PrismaCrudBag } from '@/common/base/services/prisma/prisma-crud.service';

type AdminTestimonialBag = PrismaCrudBag & {
  Model: Testimonial;
  Where: Prisma.TestimonialWhereInput;
  Select: Prisma.TestimonialSelect;
  Include: Prisma.TestimonialInclude;
  OrderBy: Prisma.TestimonialOrderByWithRelationInput;
  Create: Prisma.TestimonialCreateInput;
  Update: Prisma.TestimonialUpdateInput;
};

@Injectable()
export class TestimonialService extends PrismaCrudService<AdminTestimonialBag> {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    super(prisma.testimonial, ['id', 'created_at', 'sort_order'], 'id:DESC');
  }

  protected override async beforeCreate(createDto: AdminTestimonialBag['Create']): Promise<AdminTestimonialBag['Create']> {
    const payload = { ...createDto };

    // Validate project_id if provided
    if (payload.project_id) {
      const project = await this.prisma.project.findFirst({
        where: { id: BigInt(payload.project_id as any) },
      });

      if (!project) {
        throw new NotFoundException(`Project with ID ${payload.project_id} not found`);
      }
    }

    return payload;
  }

  protected override async beforeUpdate(
    where: Prisma.TestimonialWhereInput,
    updateDto: AdminTestimonialBag['Update'],
  ): Promise<AdminTestimonialBag['Update']> {
    const payload = { ...updateDto };

    // Validate project_id if provided
    if (payload.project_id) {
      const project = await this.prisma.project.findFirst({
        where: { id: BigInt(payload.project_id as any) },
      });

      if (!project) {
        throw new NotFoundException(`Project with ID ${payload.project_id} not found`);
      }
    }

    return payload;
  }

  protected override prepareOptions(queryOptions: any = {}) {
    const base = super.prepareOptions(queryOptions);
    const orderBy: Prisma.TestimonialOrderByWithRelationInput[] = queryOptions?.orderBy ?? [
      { sort_order: 'asc' },
      { created_at: 'desc' },
    ];
    return {
      ...base,
      include: {
        project: true,
      },
      orderBy,
    };
  }

  async toggleFeatured(id: number, featured: boolean) {
    return this.update({ id: BigInt(id) } as any, { featured } as any);
  }
}

