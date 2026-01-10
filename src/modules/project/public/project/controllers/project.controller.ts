import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { PublicProjectService } from '@/modules/project/public/project/services/project.service';
import { prepareQuery } from '@/common/base/utils/list-query.helper';

@Controller('projects')
export class PublicProjectController {
  constructor(private readonly projectService: PublicProjectService) {}

  @Get()
  findAll(@Query() query: any) {
    const { filters, options } = prepareQuery(query);
    return this.projectService.getList(filters, options);
  }

  @Get('featured')
  getFeatured(@Query('limit') limit?: number) {
    return this.projectService.getFeatured(limit ? Number(limit) : 10);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const project = await this.projectService.findBySlug(slug);
    if (!project) {
      throw new NotFoundException(`Project with slug "${slug}" not found`);
    }
    return project;
  }
}

