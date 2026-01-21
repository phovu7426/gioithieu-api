import { Controller, Get, Post, Body, Put, Delete, Param, ValidationPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateGalleryUseCase } from '@/application/use-cases/introduction/gallery/commands/create-gallery/create-gallery.usecase';
import { UpdateGalleryUseCase } from '@/application/use-cases/introduction/gallery/commands/update-gallery/update-gallery.usecase';
import { DeleteGalleryUseCase } from '@/application/use-cases/introduction/gallery/commands/delete-gallery/delete-gallery.usecase';
import { ListGalleriesUseCase } from '@/application/use-cases/introduction/gallery/queries/admin/list-galleries.usecase';
import { GetGalleryUseCase } from '@/application/use-cases/introduction/gallery/queries/admin/get-gallery.usecase';
import { CreateGalleryDto } from '@/application/use-cases/introduction/gallery/commands/create-gallery/create-gallery.dto';
import { UpdateGalleryDto } from '@/application/use-cases/introduction/gallery/commands/update-gallery/update-gallery.dto';
import { Permission } from '@/common/decorators/rbac.decorators';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RbacGuard } from '@/common/guards/rbac.guard';

@ApiTags('Admin / Introduction / Gallery')
@Controller('admin/galleries')
@UseGuards(JwtAuthGuard, RbacGuard)
export class AdminGalleryController {
  constructor(
    private readonly listUseCase: ListGalleriesUseCase,
    private readonly getUseCase: GetGalleryUseCase,
    private readonly createUseCase: CreateGalleryUseCase,
    private readonly updateUseCase: UpdateGalleryUseCase,
    private readonly deleteUseCase: DeleteGalleryUseCase,
  ) { }

  @ApiOperation({ summary: 'List all galleries' })
  @Permission('gallery.manage')
  @Get()
  async findAll() {
    return this.listUseCase.execute();
  }

  @ApiOperation({ summary: 'Get gallery by ID' })
  @Permission('gallery.manage')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.getUseCase.execute(BigInt(id));
  }

  @ApiOperation({ summary: 'Create new gallery' })
  @Permission('gallery.manage')
  @Post()
  async create(@Body(ValidationPipe) dto: CreateGalleryDto) {
    return this.createUseCase.execute(dto);
  }

  @ApiOperation({ summary: 'Update gallery' })
  @Permission('gallery.manage')
  @Put(':id')
  async update(@Param('id') id: string, @Body(ValidationPipe) dto: UpdateGalleryDto) {
    return this.updateUseCase.execute(BigInt(id), dto);
  }

  @ApiOperation({ summary: 'Delete gallery' })
  @Permission('gallery.manage')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.deleteUseCase.execute(BigInt(id));
  }
}
