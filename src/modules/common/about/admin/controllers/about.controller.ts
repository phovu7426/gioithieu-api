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
import { AboutService } from '@/modules/common/about/admin/services/about.service';
import { CreateAboutDto } from '@/modules/common/about/admin/dtos/create-about.dto';
import { UpdateAboutDto } from '@/modules/common/about/admin/dtos/update-about.dto';
import { prepareQuery } from '@/common/base/utils/list-query.helper';
import { LogRequest } from '@/common/decorators/log-request.decorator';
import { Permission } from '@/common/decorators/rbac.decorators';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RbacGuard } from '@/common/guards/rbac.guard';

@Controller('admin/about-sections')
@UseGuards(JwtAuthGuard, RbacGuard)
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @LogRequest()
  @Post()
  @Permission('about.manage')
  create(@Body(ValidationPipe) createAboutDto: CreateAboutDto) {
    return this.aboutService.create(createAboutDto);
  }

  @Get()
  @Permission('about.manage')
  findAll(@Query(ValidationPipe) query: any) {
    const { filters, options } = prepareQuery(query);
    return this.aboutService.getList(filters, options);
  }

  @Get(':id')
  @Permission('about.manage')
  findOne(@Param('id') id: string) {
    return this.aboutService.getOne({ id: BigInt(id) } as any);
  }

  @Put(':id')
  @Permission('about.manage')
  update(@Param('id') id: string, @Body(ValidationPipe) updateAboutDto: UpdateAboutDto) {
    return this.aboutService.update({ id: BigInt(id) } as any, updateAboutDto);
  }

  @Delete(':id')
  @Permission('about.manage')
  remove(@Param('id') id: string) {
    return this.aboutService.delete({ id: BigInt(id) } as any);
  }
}

