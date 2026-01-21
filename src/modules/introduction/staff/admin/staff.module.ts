import { Module } from '@nestjs/common';
import { AdminStaffController } from './controllers/staff.controller';
import { IntroductionRepositoryModule } from '@/infrastructure/persistence/prisma/repositories/introduction-repository.module';
import { CreateStaffUseCase } from '@/application/use-cases/introduction/staff/commands/create-staff/create-staff.usecase';
import { UpdateStaffUseCase } from '@/application/use-cases/introduction/staff/commands/update-staff/update-staff.usecase';
import { DeleteStaffUseCase } from '@/application/use-cases/introduction/staff/commands/delete-staff/delete-staff.usecase';
import { ListStaffUseCase } from '@/application/use-cases/introduction/staff/queries/admin/list-staff.usecase';
import { GetStaffUseCase } from '@/application/use-cases/introduction/staff/queries/admin/get-staff.usecase';

@Module({
  imports: [IntroductionRepositoryModule],
  controllers: [AdminStaffController],
  providers: [
    ListStaffUseCase,
    GetStaffUseCase,
    CreateStaffUseCase,
    UpdateStaffUseCase,
    DeleteStaffUseCase,
  ],
  exports: [
    ListStaffUseCase,
    GetStaffUseCase,
    CreateStaffUseCase,
    UpdateStaffUseCase,
    DeleteStaffUseCase,
  ],
})
export class AdminStaffModule { }
