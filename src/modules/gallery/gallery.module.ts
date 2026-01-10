import { Module } from '@nestjs/common';

// Import admin modules
import { AdminGalleryModule } from '@/modules/gallery/admin/gallery/gallery.module';

// Import public modules
import { PublicGalleryModule } from '@/modules/gallery/public/gallery/gallery.module';

@Module({
  imports: [
    // Admin modules
    AdminGalleryModule,
    // Public modules
    PublicGalleryModule,
  ],
  exports: [],
})
export class GalleryModule {}

