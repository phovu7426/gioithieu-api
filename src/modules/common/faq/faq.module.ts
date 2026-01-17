import { Module } from '@nestjs/common';

// Import admin modules
import { AdminFaqModule } from '@/modules/common/faq/admin/faq.module';

// Import public modules
import { PublicFaqModule } from '@/modules/common/faq/public/faq.module';

@Module({
  imports: [
    // Admin modules
    AdminFaqModule,
    // Public modules
    PublicFaqModule,
  ],
  exports: [],
})
export class FaqModule {}

