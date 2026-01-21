import { Module } from '@nestjs/common';
import { PublicStaffController } from '@/modules/introduction/staff/public/controllers/staff.controller';
import { IntroductionRepositoryModule } from '@/infrastructure/persistence/prisma/repositories/introduction-repository.module';
import { ListActiveStaffUseCase } from '@/application/use-cases/introduction/staff/queries/public/list-active-staff.usecase';

@Module({
  imports: [IntroductionRepositoryModule],
  controllers: [PublicStaffController],
  providers: [ListActiveStaffUseCase],
  exports: [ListActiveStaffUseCase],
})
export class PublicStaffModule { }

