import { Module } from '@nestjs/common';

// Import admin modules
import { AdminFaqModule } from '@/modules/faq/admin/faq/faq.module';

// Import public modules
import { PublicFaqModule } from '@/modules/faq/public/faq/faq.module';

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

