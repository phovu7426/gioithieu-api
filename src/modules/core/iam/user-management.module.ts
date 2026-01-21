import { Module } from '@nestjs/common';
import { UserRepositoryModule } from '@/infrastructure/persistence/prisma/repositories/user-repository.module';
import { ListUsersUseCase, GetUserUseCase } from '@/application/use-cases/user/user.usecases';

@Module({
  imports: [UserRepositoryModule],
  controllers: [],
  providers: [
    ListUsersUseCase,
    GetUserUseCase,
  ],
  exports: [ListUsersUseCase, GetUserUseCase],
})
export class UserManagementModule { }