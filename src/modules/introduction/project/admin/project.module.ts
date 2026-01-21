import { Module } from '@nestjs/common';
import { AdminProjectController } from './controllers/project.controller';
import { IntroductionRepositoryModule } from '@/infrastructure/persistence/prisma/repositories/introduction-repository.module';
import { CreateProjectUseCase } from '@/application/use-cases/introduction/project/commands/create-project/create-project.usecase';
import { UpdateProjectUseCase } from '@/application/use-cases/introduction/project/commands/update-project/update-project.usecase';
import { DeleteProjectUseCase } from '@/application/use-cases/introduction/project/commands/delete-project/delete-project.usecase';
import { ListProjectsUseCase } from '@/application/use-cases/introduction/project/queries/admin/list-projects.usecase';
import { GetProjectUseCase } from '@/application/use-cases/introduction/project/queries/admin/get-project.usecase';

@Module({
  imports: [IntroductionRepositoryModule],
  controllers: [AdminProjectController],
  providers: [
    ListProjectsUseCase,
    GetProjectUseCase,
    CreateProjectUseCase,
    UpdateProjectUseCase,
    DeleteProjectUseCase,
  ],
  exports: [
    ListProjectsUseCase,
    GetProjectUseCase,
    CreateProjectUseCase,
    UpdateProjectUseCase,
    DeleteProjectUseCase,
  ],
})
export class AdminProjectModule { }
