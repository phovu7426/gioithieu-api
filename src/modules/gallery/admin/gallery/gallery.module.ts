import { Module } from '@nestjs/common';
import { GalleryService } from '@/modules/gallery/admin/gallery/services/gallery.service';
import { GalleryController } from '@/modules/gallery/admin/gallery/controllers/gallery.controller';
import { RbacModule } from '@/modules/rbac/rbac.module';

@Module({
  imports: [
    RbacModule,
  ],
  controllers: [GalleryController],
  providers: [GalleryService],
  exports: [GalleryService],
})
export class AdminGalleryModule { }

