import { Module } from '@nestjs/common';
import { UserService } from '@/modules/common/user-management/user/user/services/user.service';
import { UserController } from '@/modules/common/user-management/user/user/controllers/user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserUserModule { }
