import { Module } from '@nestjs/common';
import { PublicPartnerService } from '@/modules/partner/public/partner/services/partner.service';
import { PublicPartnerController } from '@/modules/partner/public/partner/controllers/partner.controller';

@Module({
  imports: [],
  controllers: [PublicPartnerController],
  providers: [PublicPartnerService],
  exports: [PublicPartnerService],
})
export class PublicPartnerModule { }

