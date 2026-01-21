import { Module } from '@nestjs/common';
import { AdminGalleryController } from './controllers/gallery.controller';
import { IntroductionRepositoryModule } from '@/infrastructure/persistence/prisma/repositories/introduction-repository.module';
import { CreateGalleryUseCase } from '@/application/use-cases/introduction/gallery/commands/create-gallery/create-gallery.usecase';
import { UpdateGalleryUseCase } from '@/application/use-cases/introduction/gallery/commands/update-gallery/update-gallery.usecase';
import { DeleteGalleryUseCase } from '@/application/use-cases/introduction/gallery/commands/delete-gallery/delete-gallery.usecase';
import { ListGalleriesUseCase } from '@/application/use-cases/introduction/gallery/queries/admin/list-galleries.usecase';
import { GetGalleryUseCase } from '@/application/use-cases/introduction/gallery/queries/admin/get-gallery.usecase';

@Module({
  imports: [IntroductionRepositoryModule],
  controllers: [AdminGalleryController],
  providers: [
    CreateGalleryUseCase,
    UpdateGalleryUseCase,
    DeleteGalleryUseCase,
    ListGalleriesUseCase,
    GetGalleryUseCase,
  ],
  exports: [
    CreateGalleryUseCase,
    UpdateGalleryUseCase,
    DeleteGalleryUseCase,
    ListGalleriesUseCase,
    GetGalleryUseCase,
  ],
})
export class AdminGalleryModule { }
