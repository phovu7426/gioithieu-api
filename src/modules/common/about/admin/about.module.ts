import { Module } from '@nestjs/common';
import { AboutService } from '@/modules/common/about/admin/services/about.service';
import { AboutController } from '@/modules/common/about/admin/controllers/about.controller';
import { RbacModule } from '@/modules/rbac/rbac.module';

@Module({
  imports: [
    RbacModule,
  ],
  controllers: [AboutController],
  providers: [AboutService],
  exports: [AboutService],
})
export class AdminAboutModule { }

