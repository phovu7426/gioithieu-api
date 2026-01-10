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
import { ProjectService } from '@/modules/introduction/project/admin/project/services/project.service';
import { CreateProjectDto } from '@/modules/introduction/project/admin/project/dtos/create-project.dto';
import { UpdateProjectDto } from '@/modules/introduction/project/admin/project/dtos/update-project.dto';
import { GetProjectsDto } from '@/modules/introduction/project/admin/project/dtos/get-projects.dto';
import { ProjectStatus } from '@/shared/enums/types/project-status.enum';
import { prepareQuery } from '@/common/base/utils/list-query.helper';
import { LogRequest } from '@/common/decorators/log-request.decorator';
import { Permission } from '@/common/decorators/rbac.decorators';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RbacGuard } from '@/common/guards/rbac.guard';

@Controller('admin/projects')
@UseGuards(JwtAuthGuard, RbacGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

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
  findOne(@Param('id') id: string) {
    return this.projectService.getOne({ id: BigInt(id) } as any);
  }

  @Put(':id')
  @Permission('project.manage')
  update(@Param('id') id: string, @Body(ValidationPipe) updateProjectDto: UpdateProjectDto) {
    return this.projectService.update({ id: BigInt(id) } as any, updateProjectDto);
  }

  @Delete(':id')
  @Permission('project.manage')
  remove(@Param('id') id: string) {
    return this.projectService.delete({ id: BigInt(id) } as any);
  }

  @Patch(':id/status')
  @Permission('project.manage')
  changeStatus(@Param('id') id: string, @Body('status') status: ProjectStatus) {
    return this.projectService.changeStatus(Number(id), status);
  }

  @Patch(':id/featured')
  @Permission('project.manage')
  toggleFeatured(@Param('id') id: string, @Body('featured') featured: boolean) {
    return this.projectService.toggleFeatured(Number(id), featured);
  }

  @Patch(':id/sort-order')
  @Permission('project.manage')
  updateSortOrder(@Param('id') id: string, @Body('sort_order') sortOrder: number) {
    return this.projectService.updateSortOrder(Number(id), sortOrder);
  }
}

