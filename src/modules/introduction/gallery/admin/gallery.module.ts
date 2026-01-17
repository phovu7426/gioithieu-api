import { Module } from '@nestjs/common';
import { GalleryService } from '@/modules/introduction/gallery/admin/services/gallery.service';
import { GalleryController } from '@/modules/introduction/gallery/admin/controllers/gallery.controller';
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

