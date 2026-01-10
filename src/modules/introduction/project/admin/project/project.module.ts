import { Module } from '@nestjs/common';
import { ProjectService } from '@/modules/introduction/project/admin/project/services/project.service';
import { ProjectController } from '@/modules/introduction/project/admin/project/controllers/project.controller';
import { RbacModule } from '@/modules/rbac/rbac.module';

@Module({
  imports: [
    RbacModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class AdminProjectModule { }

