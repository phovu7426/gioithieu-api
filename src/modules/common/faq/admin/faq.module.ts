import { Module } from '@nestjs/common';
import { FaqService } from '@/modules/common/faq/admin/services/faq.service';
import { FaqController } from '@/modules/common/faq/admin/controllers/faq.controller';
import { RbacModule } from '@/modules/rbac/rbac.module';
import { FaqRepositoryModule } from '../faq.repository.module';

@Module({
  imports: [
    RbacModule,
    FaqRepositoryModule,
  ],
  controllers: [FaqController],
  providers: [FaqService],
  exports: [FaqService],
})
export class AdminFaqModule { }

