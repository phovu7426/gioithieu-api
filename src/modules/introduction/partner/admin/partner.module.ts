import { Module } from '@nestjs/common';
import { PartnerController } from '@/modules/introduction/partner/admin/controllers/partner.controller';
<<<<<<< HEAD
import { RbacModule } from '@/modules/core/rbac/rbac.module';
import { IntroductionRepositoryModule } from '@/infrastructure/persistence/prisma/repositories/introduction-repository.module';
import { CreatePartnerUseCase } from '@/application/use-cases/introduction/partner/commands/create-partner/create-partner.usecase';
import { UpdatePartnerUseCase } from '@/application/use-cases/introduction/partner/commands/update-partner/update-partner.usecase';
import { DeletePartnerUseCase } from '@/application/use-cases/introduction/partner/commands/delete-partner/delete-partner.usecase';
import { ListPartnersUseCase } from '@/application/use-cases/introduction/partner/queries/admin/list-partners.usecase';
import { GetPartnerUseCase } from '@/application/use-cases/introduction/partner/queries/admin/get-partner.usecase';
=======
import { RbacModule } from '@/modules/rbac/rbac.module';
>>>>>>> parent of cf58bf3 (fix repo)

@Module({
  imports: [
    RbacModule,
<<<<<<< HEAD
    IntroductionRepositoryModule,
=======
>>>>>>> parent of cf58bf3 (fix repo)
  ],
  controllers: [PartnerController],
  providers: [
    CreatePartnerUseCase,
    UpdatePartnerUseCase,
    DeletePartnerUseCase,
    ListPartnersUseCase,
    GetPartnerUseCase,
  ],
  exports: [
    CreatePartnerUseCase,
    UpdatePartnerUseCase,
    DeletePartnerUseCase,
    ListPartnersUseCase,
    GetPartnerUseCase,
  ],
})
export class AdminPartnerModule { }

