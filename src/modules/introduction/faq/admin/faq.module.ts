import { Module } from '@nestjs/common';
import { FaqController } from '@/modules/introduction/faq/admin/controllers/faq.controller';
import { RbacModule } from '@/modules/core/rbac/rbac.module';
import { IntroductionRepositoryModule } from '@/infrastructure/persistence/prisma/repositories/introduction-repository.module';
import { CreateFaqUseCase } from '@/application/use-cases/introduction/faq/commands/create-faq/create-faq.usecase';
import { UpdateFaqUseCase } from '@/application/use-cases/introduction/faq/commands/update-faq/update-faq.usecase';
import { DeleteFaqUseCase } from '@/application/use-cases/introduction/faq/commands/delete-faq/delete-faq.usecase';
import { ListFaqsUseCase } from '@/application/use-cases/introduction/faq/queries/admin/list-faqs.usecase';
import { GetFaqUseCase } from '@/application/use-cases/introduction/faq/queries/admin/get-faq.usecase';

@Module({
  imports: [
    RbacModule,
    IntroductionRepositoryModule,
  ],
  controllers: [FaqController],
  providers: [
    ListFaqsUseCase,
    GetFaqUseCase,
    CreateFaqUseCase,
    UpdateFaqUseCase,
    DeleteFaqUseCase,
  ],
  exports: [
    ListFaqsUseCase,
    GetFaqUseCase,
    CreateFaqUseCase,
    UpdateFaqUseCase,
    DeleteFaqUseCase,
  ],
})
export class AdminFaqModule { }

