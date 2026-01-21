import { Module } from '@nestjs/common';
<<<<<<< HEAD
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
=======
import { ProjectService } from '@/modules/introduction/project/admin/services/project.service';
import { ProjectController } from '@/modules/introduction/project/admin/controllers/project.controller';
import { RbacModule } from '@/modules/rbac/rbac.module';

@Module({
  imports: [
    RbacModule,
>>>>>>> parent of cf58bf3 (fix repo)
  ],
})
export class AdminProjectModule { }
