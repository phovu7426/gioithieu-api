import { Module } from '@nestjs/common';
import { PublicProjectController } from '@/modules/introduction/project/public/controllers/project.controller';
import { IntroductionRepositoryModule } from '@/infrastructure/persistence/prisma/repositories/introduction-repository.module';
import { ListActiveProjectsUseCase } from '@/application/use-cases/introduction/project/queries/public/list-active-projects.usecase';

@Module({
  imports: [IntroductionRepositoryModule],
  controllers: [PublicProjectController],
  providers: [ListActiveProjectsUseCase],
  exports: [ListActiveProjectsUseCase],
})
export class PublicProjectModule { }

