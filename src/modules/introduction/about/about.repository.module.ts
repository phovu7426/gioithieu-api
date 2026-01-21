import { Module } from '@nestjs/common';
import { ABOUT_REPOSITORY } from './repositories/about.repository.interface';
import { AboutPrismaRepository } from './repositories/about.prisma.repository';

@Module({
    providers: [
        {
            provide: ABOUT_REPOSITORY,
            useClass: AboutPrismaRepository,
        },
    ],
    exports: [ABOUT_REPOSITORY],
})
export class AboutRepositoryModule { }
