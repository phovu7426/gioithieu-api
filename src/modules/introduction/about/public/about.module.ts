import { Module } from '@nestjs/common';
import { PublicAboutController } from '@/modules/introduction/about/public/controllers/about.controller';
import { IntroductionRepositoryModule } from '@/infrastructure/persistence/prisma/repositories/introduction-repository.module';
import { ListActiveAboutSectionsUseCase } from '@/application/use-cases/introduction/about/queries/public/list-active-sections.usecase';
import { GetAboutSectionBySlugUseCase } from '@/application/use-cases/introduction/about/queries/public/get-section-by-slug.usecase';

@Module({
  imports: [IntroductionRepositoryModule],
  controllers: [PublicAboutController],
  providers: [
    ListActiveAboutSectionsUseCase,
    GetAboutSectionBySlugUseCase,
  ],
  exports: [
    ListActiveAboutSectionsUseCase,
    GetAboutSectionBySlugUseCase,
  ],
})
export class PublicAboutModule { }

