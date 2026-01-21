import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ListActiveProjectsUseCase } from '@/application/use-cases/introduction/project/queries/public/list-active-projects.usecase';

@ApiTags('Public / Projects')
@Controller('projects')
export class PublicProjectController {
  constructor(private readonly listActiveUseCase: ListActiveProjectsUseCase) { }

  @ApiOperation({ summary: 'Get all active projects' })
  @Get()
  async findAll() {
    return this.listActiveUseCase.execute();
  }
}
