import { Module } from '@nestjs/common';

// Import admin modules
import { AdminGalleryModule } from '@/modules/introduction/gallery/admin/gallery.module';

// Import public modules
import { PublicGalleryModule } from '@/modules/introduction/gallery/public/gallery.module';

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

