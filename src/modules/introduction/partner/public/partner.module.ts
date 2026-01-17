import { Module } from '@nestjs/common';
import { PublicPartnerService } from '@/modules/introduction/partner/public/services/partner.service';
import { PublicPartnerController } from '@/modules/introduction/partner/public/controllers/partner.controller';

@Module({
  imports: [],
  controllers: [PublicPartnerController],
  providers: [PublicPartnerService],
  exports: [PublicPartnerService],
})
export class PublicPartnerModule { }

