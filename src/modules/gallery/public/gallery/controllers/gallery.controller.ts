import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { PublicGalleryService } from '@/modules/gallery/public/gallery/services/gallery.service';
import { prepareQuery } from '@/common/base/utils/list-query.helper';
import { Permission } from '@/common/decorators/rbac.decorators';

@Controller('gallery')
export class PublicGalleryController {
  constructor(private readonly galleryService: PublicGalleryService) {}

  @Permission('public')
  @Get()
  findAll(@Query() query: any) {
    const { filters, options } = prepareQuery(query);
    return this.galleryService.getList(filters, options);
  }

  @Permission('public')
  @Get('featured')
  getFeatured(@Query('limit') limit?: number) {
    return this.galleryService.getFeatured(limit ? Number(limit) : 10);
  }

  @Permission('public')
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const gallery = await this.galleryService.findBySlug(slug);
    if (!gallery) {
      throw new NotFoundException(`Gallery with slug "${slug}" not found`);
    }
    return gallery;
  }
}

