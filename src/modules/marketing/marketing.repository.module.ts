
import { Module, Global } from '@nestjs/common';
import { PrismaModule } from '@/core/database/prisma/prisma.module';
import { BannerPrismaRepository } from './repositories/banner.prisma.repository';
import { BANNER_REPOSITORY } from './repositories/banner.repository.interface';
import { BannerLocationPrismaRepository } from './repositories/banner-location.prisma.repository';
import { BANNER_LOCATION_REPOSITORY } from './repositories/banner-location.repository.interface';

@Global()
@Module({
    imports: [PrismaModule],
    providers: [
        {
            provide: BANNER_REPOSITORY,
            useClass: BannerPrismaRepository,
        },
        {
            provide: BANNER_LOCATION_REPOSITORY,
            useClass: BannerLocationPrismaRepository,
        },
    ],
    exports: [BANNER_REPOSITORY, BANNER_LOCATION_REPOSITORY],
})
export class MarketingRepositoryModule { }
