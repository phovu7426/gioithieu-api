import { Module } from '@nestjs/common';
import { PublicFaqService } from '@/modules/faq/public/faq/services/faq.service';
import { PublicFaqController } from '@/modules/faq/public/faq/controllers/faq.controller';

@Module({
  imports: [],
  controllers: [PublicFaqController],
  providers: [PublicFaqService],
  exports: [PublicFaqService],
})
export class PublicFaqModule { }

