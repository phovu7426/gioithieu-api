import { Module } from '@nestjs/common';

// Import admin modules
import { AdminAboutModule } from '@/modules/about/admin/about/about.module';

// Import public modules
import { PublicAboutModule } from '@/modules/about/public/about/about.module';

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

