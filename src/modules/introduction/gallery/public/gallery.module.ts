import { Module } from '@nestjs/common';
import { PublicGalleryController } from '@/modules/introduction/gallery/public/controllers/gallery.controller';
<<<<<<< HEAD
import { IntroductionRepositoryModule } from '@/infrastructure/persistence/prisma/repositories/introduction-repository.module';
import { ListActiveGalleriesUseCase } from '@/application/use-cases/introduction/gallery/queries/public/list-active-galleries.usecase';
import { GetPublicGalleryUseCase } from '@/application/use-cases/introduction/gallery/queries/public/get-public-gallery.usecase';

@Module({
  imports: [IntroductionRepositoryModule],
=======

@Module({
  imports: [],
>>>>>>> parent of cf58bf3 (fix repo)
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

