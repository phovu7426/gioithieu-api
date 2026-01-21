import { Controller, Get, Post, Put, Delete, Body, Param, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateProjectUseCase } from '@/application/use-cases/introduction/project/commands/create-project/create-project.usecase';
import { UpdateProjectUseCase } from '@/application/use-cases/introduction/project/commands/update-project/update-project.usecase';
import { DeleteProjectUseCase } from '@/application/use-cases/introduction/project/commands/delete-project/delete-project.usecase';
import { ListProjectsUseCase } from '@/application/use-cases/introduction/project/queries/admin/list-projects.usecase';
import { GetProjectUseCase } from '@/application/use-cases/introduction/project/queries/admin/get-project.usecase';
import { CreateProjectDto } from '@/application/use-cases/introduction/project/commands/create-project/create-project.dto';
import { UpdateProjectDto } from '@/application/use-cases/introduction/project/commands/update-project/update-project.dto';
import { Permission } from '@/common/decorators/rbac.decorators';

@ApiTags('Admin / Introduction / Projects')
@Controller('admin/projects')
export class AdminProjectController {
  constructor(
    private readonly listUseCase: ListProjectsUseCase,
    private readonly getUseCase: GetProjectUseCase,
    private readonly createUseCase: CreateProjectUseCase,
    private readonly updateUseCase: UpdateProjectUseCase,
    private readonly deleteUseCase: DeleteProjectUseCase,
  ) { }

  @ApiOperation({ summary: 'List all projects' })
  @Permission('project.manage')
  @Get()
  async findAll() {
    return this.listUseCase.execute();
  }

  @ApiOperation({ summary: 'Get project by ID' })
  @Permission('project.manage')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.getUseCase.execute(BigInt(id));
  }

  @ApiOperation({ summary: 'Create new project' })
  @Permission('project.manage')
  @Post()
  async create(@Body(ValidationPipe) dto: CreateProjectDto) {
    return this.createUseCase.execute(dto);
  }

  @ApiOperation({ summary: 'Update project' })
  @Permission('project.manage')
  @Put(':id')
  async update(@Param('id') id: string, @Body(ValidationPipe) dto: UpdateProjectDto) {
    return this.updateUseCase.execute(BigInt(id), dto);
  }

  @ApiOperation({ summary: 'Delete project' })
  @Permission('project.manage')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.deleteUseCase.execute(BigInt(id));
  }
}
