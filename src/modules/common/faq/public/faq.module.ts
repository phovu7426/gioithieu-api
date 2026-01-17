import { Module } from '@nestjs/common';
import { PublicFaqService } from '@/modules/common/faq/public/services/faq.service';
import { PublicFaqController } from '@/modules/common/faq/public/controllers/faq.controller';

@Module({
  imports: [],
  controllers: [PublicFaqController],
  providers: [PublicFaqService],
  exports: [PublicFaqService],
})
export class PublicFaqModule { }

