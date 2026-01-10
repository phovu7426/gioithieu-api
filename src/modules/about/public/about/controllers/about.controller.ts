import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { PublicAboutService } from '@/modules/about/public/about/services/about.service';
import { AboutSectionType } from '@/shared/enums/types/about-section-type.enum';
import { prepareQuery } from '@/common/base/utils/list-query.helper';

@Controller('about-sections')
export class PublicAboutController {
  constructor(private readonly aboutService: PublicAboutService) {}

  @Get()
  findAll(@Query() query: any) {
    const { filters, options } = prepareQuery(query);
    return this.aboutService.getList(filters, options);
  }

  @Get('type/:type')
  findByType(@Param('type') type: AboutSectionType) {
    return this.aboutService.findByType(type);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const section = await this.aboutService.findBySlug(slug);
    if (!section) {
      throw new NotFoundException(`About section with slug "${slug}" not found`);
    }
    return section;
  }
}

