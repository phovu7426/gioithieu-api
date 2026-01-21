import { Module } from '@nestjs/common';
import { AdminGalleryModule } from './admin/gallery.module';

@Module({
  imports: [AdminGalleryModule],
  exports: [AdminGalleryModule],
})
export class GalleryModule {}
