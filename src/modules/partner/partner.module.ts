import { Module } from '@nestjs/common';

// Import admin modules
import { AdminPartnerModule } from '@/modules/partner/admin/partner/partner.module';

// Import public modules
import { PublicPartnerModule } from '@/modules/partner/public/partner/partner.module';

@Module({
  imports: [
    // Admin modules
    AdminPartnerModule,
    // Public modules
    PublicPartnerModule,
  ],
  exports: [],
})
export class PartnerModule {}

