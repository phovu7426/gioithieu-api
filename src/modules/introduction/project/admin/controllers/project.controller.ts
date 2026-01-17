import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  Patch,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from '@/modules/introduction/project/admin/services/project.service';
import { CreateProjectDto } from '@/modules/introduction/project/admin/dtos/create-project.dto';
import { UpdateProjectDto } from '@/modules/introduction/project/admin/dtos/update-project.dto';
import { GetProjectsDto } from '@/modules/introduction/project/admin/dtos/get-projects.dto';
import { ProjectStatus } from '@/shared/enums/types/project-status.enum';
import { prepareQuery } from '@/common/base/utils/list-query.helper';
import { LogRequest } from '@/common/decorators/log-request.decorator';
import { Permission } from '@/common/decorators/rbac.decorators';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RbacGuard } from '@/common/guards/rbac.guard';
import { ParseBigIntPipe } from '@/common/pipes/parse-bigint.pipe';

@Controller('admin/projects')
@UseGuards(JwtAuthGuard, RbacGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @LogRequest()
  @Post()
  @Permission('project.manage')
  create(@Body(ValidationPipe) createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  @Permission('project.manage')
  findAll(@Query(ValidationPipe) query: GetProjectsDto) {
    const { filters, options } = prepareQuery(query);
    return this.projectService.getList(filters, options);
  }

  @Get(':id')
  @Permission('project.manage')
  findOne(@Param('id', ParseBigIntPipe) id: bigint) {
    return this.projectService.getOne({ id: id } as any);
  }

  @Put(':id')
  @Permission('project.manage')
  update(@Param('id', ParseBigIntPipe) id: bigint, @Body(ValidationPipe) updateProjectDto: UpdateProjectDto) {
    return this.projectService.update({ id: id } as any, updateProjectDto);
  }

  @Delete(':id')
  @Permission('project.manage')
  remove(@Param('id', ParseBigIntPipe) id: bigint) {
    return this.projectService.delete({ id: id } as any);
  }

  @Patch(':id/status')
  @Permission('project.manage')
  changeStatus(@Param('id', ParseBigIntPipe) id: bigint, @Body('status') status: ProjectStatus) {
    return this.projectService.changeStatus(id, status);
  }

  @Patch(':id/featured')
  @Permission('project.manage')
  toggleFeatured(@Param('id', ParseBigIntPipe) id: bigint, @Body('featured') featured: boolean) {
    return this.projectService.toggleFeatured(id, featured);
  }

  @Patch(':id/sort-order')
  @Permission('project.manage')
  updateSortOrder(@Param('id', ParseBigIntPipe) id: bigint, @Body('sort_order') sortOrder: number) {
    return this.projectService.updateSortOrder(id, sortOrder);
  }
}

