import { Module } from '@nestjs/common';
import { PublicGalleryController } from '@/modules/introduction/gallery/public/controllers/gallery.controller';
import { IntroductionRepositoryModule } from '@/infrastructure/persistence/prisma/repositories/introduction-repository.module';
import { ListActiveGalleriesUseCase } from '@/application/use-cases/introduction/gallery/queries/public/list-active-galleries.usecase';
import { GetPublicGalleryUseCase } from '@/application/use-cases/introduction/gallery/queries/public/get-public-gallery.usecase';

@Module({
  imports: [IntroductionRepositoryModule],
  controllers: [PublicGalleryController],
  providers: [
    ListActiveGalleriesUseCase,
    GetPublicGalleryUseCase,
  ],
  exports: [
    ListActiveGalleriesUseCase,
    GetPublicGalleryUseCase,
  ],
})
export class PublicGalleryModule { }

