import { Module } from '@nestjs/common';

// Import admin modules
import { AdminContactModule } from '@/modules/contact/admin/contact.module';

// Import public modules
import { PublicContactModule } from '@/modules/contact/public/contact.module';

@Module({
  imports: [
    // Admin modules
    AdminContactModule,
    // Public modules
    PublicContactModule,
  ],
  exports: [],
})
export class ContactModule {}

