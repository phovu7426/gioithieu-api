import { Module } from '@nestjs/common';
import { PublicFaqController } from '@/modules/introduction/faq/public/controllers/faq.controller';
import { IntroductionRepositoryModule } from '@/infrastructure/persistence/prisma/repositories/introduction-repository.module';
import { ListActiveFaqsUseCase } from '@/application/use-cases/introduction/faq/queries/public/list-active-faqs.usecase';
import { ListPopularFaqsUseCase } from '@/application/use-cases/introduction/faq/queries/public/list-popular-faqs.usecase';
import { GetPublicFaqUseCase } from '@/application/use-cases/introduction/faq/queries/public/get-public-faq.usecase';
import { MarkFaqHelpfulUseCase } from '@/application/use-cases/introduction/faq/commands/mark-helpful/mark-helpful.usecase';

@Module({
  imports: [IntroductionRepositoryModule],
  controllers: [PublicFaqController],
  providers: [
    ListActiveFaqsUseCase,
    ListPopularFaqsUseCase,
    GetPublicFaqUseCase,
    MarkFaqHelpfulUseCase,
  ],
  exports: [
    ListActiveFaqsUseCase,
    ListPopularFaqsUseCase,
    GetPublicFaqUseCase,
    MarkFaqHelpfulUseCase,
  ],
})
export class PublicFaqModule { }

