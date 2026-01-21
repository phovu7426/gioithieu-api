import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/database/prisma/prisma.module';
import { BannerPrismaRepository, BannerLocationPrismaRepository } from './marketing.prisma.repository';
import { BannerMapper, BannerLocationMapper } from '../mappers/marketing.mapper';

@Module({
    imports: [PrismaModule],
    providers: [
        BannerMapper, BannerLocationMapper,
        { provide: 'IBannerRepository', useClass: BannerPrismaRepository },
        { provide: 'IBannerLocationRepository', useClass: BannerLocationPrismaRepository },
    ],
    exports: ['IBannerRepository', 'IBannerLocationRepository'],
})
export class MarketingRepositoryModule { }
