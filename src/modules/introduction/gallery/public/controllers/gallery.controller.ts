import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ListActiveGalleriesUseCase } from '@/application/use-cases/introduction/gallery/queries/public/list-active-galleries.usecase';
import { GetPublicGalleryUseCase } from '@/application/use-cases/introduction/gallery/queries/public/get-public-gallery.usecase';
import { Permission } from '@/common/decorators/rbac.decorators';

@ApiTags('Public / Gallery')
@Controller('galleries')
export class PublicGalleryController {
  constructor(
    private readonly listActiveUseCase: ListActiveGalleriesUseCase,
    private readonly getBySlugUseCase: GetPublicGalleryUseCase,
  ) { }

  @ApiOperation({ summary: 'List all active galleries' })
  @Permission('public')
  @Get()
  findAll() {
    return this.listActiveUseCase.execute();
  }

  @ApiOperation({ summary: 'Get gallery by slug' })
  @Permission('public')
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.getBySlugUseCase.execute(slug);
  }
}

