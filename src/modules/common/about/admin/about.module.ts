import { Module } from '@nestjs/common';
import { AboutService } from '@/modules/common/about/admin/services/about.service';
import { AboutController } from '@/modules/common/about/admin/controllers/about.controller';
import { AboutRepositoryModule } from '@/modules/common/about/about.repository.module';
import { RbacModule } from '@/modules/rbac/rbac.module';

@Module({
  imports: [
    RbacModule,
    AboutRepositoryModule,
  ],
  controllers: [AboutController],
  providers: [AboutService],
  exports: [AboutService],
})
export class AdminAboutModule { }

