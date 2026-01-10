import { Module } from '@nestjs/common';
import { PublicGalleryService } from '@/modules/introduction/gallery/public/gallery/services/gallery.service';
import { PublicGalleryController } from '@/modules/introduction/gallery/public/gallery/controllers/gallery.controller';

@Module({
  imports: [],
  controllers: [PublicGalleryController],
  providers: [PublicGalleryService],
  exports: [PublicGalleryService],
})
export class PublicGalleryModule { }

