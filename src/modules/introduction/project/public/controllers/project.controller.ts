import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { PublicProjectService } from '@/modules/introduction/project/public/services/project.service';
import { prepareQuery } from '@/common/base/utils/list-query.helper';
import { Permission } from '@/common/decorators/rbac.decorators';

@Controller('projects')
export class PublicProjectController {
  constructor(private readonly projectService: PublicProjectService) {}

  @Permission('public')
  @Get()
  findAll(@Query() query: any) {
    const { filters, options } = prepareQuery(query);
    return this.projectService.getList(filters, options);
  }

  @Permission('public')
  @Get('featured')
  getFeatured(@Query('limit') limit?: number) {
    return this.projectService.getFeatured(limit ? Number(limit) : 10);
  }

  @Permission('public')
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const project = await this.projectService.findBySlug(slug);
    if (!project) {
      throw new NotFoundException(`Project with slug "${slug}" not found`);
    }
    return project;
  }
}

