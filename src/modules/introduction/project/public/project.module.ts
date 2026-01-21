import { Module } from '@nestjs/common';
import { PublicProjectController } from '@/modules/introduction/project/public/controllers/project.controller';
<<<<<<< HEAD
import { IntroductionRepositoryModule } from '@/infrastructure/persistence/prisma/repositories/introduction-repository.module';
import { ListActiveProjectsUseCase } from '@/application/use-cases/introduction/project/queries/public/list-active-projects.usecase';

@Module({
  imports: [IntroductionRepositoryModule],
=======

@Module({
  imports: [],
>>>>>>> parent of cf58bf3 (fix repo)
  controllers: [PublicProjectController],
  providers: [ListActiveProjectsUseCase],
  exports: [ListActiveProjectsUseCase],
})
export class PublicProjectModule { }

