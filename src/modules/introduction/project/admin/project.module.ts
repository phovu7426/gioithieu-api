import { Module } from '@nestjs/common';
import { ProjectService } from '@/modules/introduction/project/admin/services/project.service';
import { ProjectController } from '@/modules/introduction/project/admin/controllers/project.controller';
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

