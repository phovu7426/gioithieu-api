import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { GalleryService } from '@/modules/introduction/gallery/admin/gallery/services/gallery.service';
import { CreateGalleryDto } from '@/modules/introduction/gallery/admin/gallery/dtos/create-gallery.dto';
import { UpdateGalleryDto } from '@/modules/introduction/gallery/admin/gallery/dtos/update-gallery.dto';
import { prepareQuery } from '@/common/base/utils/list-query.helper';
import { LogRequest } from '@/common/decorators/log-request.decorator';
import { Permission } from '@/common/decorators/rbac.decorators';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RbacGuard } from '@/common/guards/rbac.guard';

@Controller('admin/gallery')
@UseGuards(JwtAuthGuard, RbacGuard)
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @LogRequest()
  @Post()
  @Permission('gallery.manage')
  create(@Body(ValidationPipe) createGalleryDto: CreateGalleryDto) {
    return this.galleryService.create(createGalleryDto);
  }

  @Get()
  @Permission('gallery.manage')
  findAll(@Query(ValidationPipe) query: any) {
    const { filters, options } = prepareQuery(query);
    return this.galleryService.getList(filters, options);
  }

  @Get(':id')
  @Permission('gallery.manage')
  findOne(@Param('id') id: string) {
    return this.galleryService.getOne({ id: BigInt(id) } as any);
  }

  @Put(':id')
  @Permission('gallery.manage')
  update(@Param('id') id: string, @Body(ValidationPipe) updateGalleryDto: UpdateGalleryDto) {
    return this.galleryService.update({ id: BigInt(id) } as any, updateGalleryDto);
  }

  @Delete(':id')
  @Permission('gallery.manage')
  remove(@Param('id') id: string) {
    return this.galleryService.delete({ id: BigInt(id) } as any);
  }
}

