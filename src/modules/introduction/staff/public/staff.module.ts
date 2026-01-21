import { Module } from '@nestjs/common';
import { PublicStaffController } from '@/modules/introduction/staff/public/controllers/staff.controller';
<<<<<<< HEAD
import { IntroductionRepositoryModule } from '@/infrastructure/persistence/prisma/repositories/introduction-repository.module';
import { ListActiveStaffUseCase } from '@/application/use-cases/introduction/staff/queries/public/list-active-staff.usecase';

@Module({
  imports: [IntroductionRepositoryModule],
=======

@Module({
  imports: [],
>>>>>>> parent of cf58bf3 (fix repo)
  controllers: [PublicStaffController],
  providers: [ListActiveStaffUseCase],
  exports: [ListActiveStaffUseCase],
})
export class PublicStaffModule { }

