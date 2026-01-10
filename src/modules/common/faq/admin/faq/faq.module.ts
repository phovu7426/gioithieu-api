import { Module } from '@nestjs/common';
import { FaqService } from '@/modules/common/faq/admin/faq/services/faq.service';
import { FaqController } from '@/modules/common/faq/admin/faq/controllers/faq.controller';
import { RbacModule } from '@/modules/rbac/rbac.module';

@Module({
  imports: [
    RbacModule,
  ],
  controllers: [FaqController],
  providers: [FaqService],
  exports: [FaqService],
})
export class AdminFaqModule { }

