import { Module } from '@nestjs/common';
import { UserService } from '@/modules/core/iam/user/user/services/user.service';
import { UserController } from '@/modules/core/iam/user/user/controllers/user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserUserModule { }
