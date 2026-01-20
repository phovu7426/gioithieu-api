
import { Module } from '@nestjs/common';
import { GALLERY_REPOSITORY } from './repositories/gallery.repository.interface';
import { GalleryPrismaRepository } from './repositories/gallery.prisma.repository';

@Module({
    providers: [
        {
            provide: GALLERY_REPOSITORY,
            useClass: GalleryPrismaRepository,
        },
    ],
    exports: [GALLERY_REPOSITORY],
})
export class GalleryRepositoryModule { }
