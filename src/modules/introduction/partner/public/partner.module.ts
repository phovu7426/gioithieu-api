import { Module } from '@nestjs/common';
import { PublicPartnerController } from '@/modules/introduction/partner/public/controllers/partner.controller';
<<<<<<< HEAD
import { IntroductionRepositoryModule } from '@/infrastructure/persistence/prisma/repositories/introduction-repository.module';
import { ListActivePartnersUseCase } from '@/application/use-cases/introduction/partner/queries/public/list-active-partners.usecase';
import { ListPartnersByTypeUseCase } from '@/application/use-cases/introduction/partner/queries/public/list-partners-by-type.usecase';

@Module({
  imports: [IntroductionRepositoryModule],
=======

@Module({
  imports: [],
>>>>>>> parent of cf58bf3 (fix repo)
  controllers: [PublicPartnerController],
  providers: [
    ListActivePartnersUseCase,
    ListPartnersByTypeUseCase,
  ],
  exports: [
    ListActivePartnersUseCase,
    ListPartnersByTypeUseCase,
  ],
})
export class PublicPartnerModule { }

