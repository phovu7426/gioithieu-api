import { Injectable } from '@nestjs/common';
import { Prisma, AboutSection } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { PrismaCrudService, PrismaCrudBag } from '@/common/base/services/prisma/prisma-crud.service';
import { StringUtil } from '@/core/utils/string.util';

type AdminAboutBag = PrismaCrudBag & {
  Model: AboutSection;
  Where: Prisma.AboutSectionWhereInput;
  Select: Prisma.AboutSectionSelect;
  Include: Record<string, never>;
  OrderBy: Prisma.AboutSectionOrderByWithRelationInput;
  Create: Prisma.AboutSectionCreateInput;
  Update: Prisma.AboutSectionUpdateInput;
};

@Injectable()
export class AboutService extends PrismaCrudService<AdminAboutBag> {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    super(prisma.aboutSection, ['id', 'created_at', 'sort_order'], 'id:DESC');
  }

  protected override async beforeCreate(createDto: AdminAboutBag['Create']): Promise<AdminAboutBag['Create']> {
    const payload = { ...createDto };
    await this.ensureSlug(payload);
    return payload;
  }

  protected override async beforeUpdate(
    where: Prisma.AboutSectionWhereInput,
    updateDto: AdminAboutBag['Update'],
  ): Promise<AdminAboutBag['Update']> {
    const payload = { ...updateDto };
    const id = (where as any).id ? BigInt((where as any).id) : null;
    const current = id
      ? await this.prisma.aboutSection.findFirst({ where: { id } })
      : null;
    await this.ensureSlug(payload, id ? Number(id) : undefined, current?.slug || undefined);
    return payload;
  }

  private async ensureSlug(data: any, excludeId?: number, currentSlug?: string): Promise<void> {
    if (data.title && !data.slug) {
      data.slug = StringUtil.toSlug(data.title);
      return;
    }

    if (data.slug) {
      const normalizedSlug = StringUtil.toSlug(data.slug);
      const normalizedCurrentSlug = currentSlug ? StringUtil.toSlug(currentSlug) : null;

      if (normalizedCurrentSlug && normalizedSlug === normalizedCurrentSlug) {
        delete data.slug;
        return;
      }

      const existing = await this.prisma.aboutSection.findFirst({
        where: {
          slug: normalizedSlug,
          deleted_at: null,
          ...(excludeId ? { id: { not: BigInt(excludeId) } } : {}),
        },
      });

      if (existing) {
        let counter = 1;
        let uniqueSlug = `${normalizedSlug}-${counter}`;
        while (await this.prisma.aboutSection.findFirst({
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

  protected override prepareOptions(queryOptions: any = {}) {
    const base = super.prepareOptions(queryOptions);
    const orderBy: Prisma.AboutSectionOrderByWithRelationInput[] = queryOptions?.orderBy ?? [
      { sort_order: 'asc' },
      { created_at: 'desc' },
    ];
    return {
      ...base,
      orderBy,
    };
  }
}

