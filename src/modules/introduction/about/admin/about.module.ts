import { Module } from '@nestjs/common';
import { AboutController } from '@/modules/introduction/about/admin/controllers/about.controller';
import { IntroductionRepositoryModule } from '@/infrastructure/persistence/prisma/repositories/introduction-repository.module';
import { RbacModule } from '@/modules/core/rbac/rbac.module';
import { CreateAboutSectionUseCase } from '@/application/use-cases/introduction/about/commands/create-section/create-section.usecase';
import { UpdateAboutSectionUseCase } from '@/application/use-cases/introduction/about/commands/update-section/update-section.usecase';
import { DeleteAboutSectionUseCase } from '@/application/use-cases/introduction/about/commands/delete-section/delete-section.usecase';
import { ListAboutSectionsUseCase } from '@/application/use-cases/introduction/about/queries/admin/list-sections.usecase';
import { GetAboutSectionUseCase } from '@/application/use-cases/introduction/about/queries/admin/get-section.usecase';

@Module({
  imports: [
    RbacModule,
    IntroductionRepositoryModule,
  ],
  controllers: [AboutController],
  providers: [
    CreateAboutSectionUseCase,
    UpdateAboutSectionUseCase,
    DeleteAboutSectionUseCase,
    ListAboutSectionsUseCase,
    GetAboutSectionUseCase,
  ],
  exports: [
    CreateAboutSectionUseCase,
    UpdateAboutSectionUseCase,
    DeleteAboutSectionUseCase,
    ListAboutSectionsUseCase,
    GetAboutSectionUseCase,
  ],
})
export class AdminAboutModule { }

