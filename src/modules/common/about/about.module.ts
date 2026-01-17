import { Module } from '@nestjs/common';

// Import admin modules
import { AdminAboutModule } from '@/modules/common/about/admin/about.module';

// Import public modules
import { PublicAboutModule } from '@/modules/common/about/public/about.module';

@Module({
  imports: [
    // Admin modules
    AdminAboutModule,
    // Public modules
    PublicAboutModule,
  ],
  exports: [],
})
export class AboutModule {}

