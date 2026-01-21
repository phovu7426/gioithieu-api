import { Module } from '@nestjs/common';
import { AdminBannerController } from './admin/controllers/banner.controller';
import { MarketingRepositoryModule } from '@/infrastructure/persistence/prisma/repositories/marketing-repository.module';
import { ListActiveBannersUseCase, ListAllBannersUseCase } from '@/application/use-cases/marketing/banner.usecases';

@Module({
    imports: [MarketingRepositoryModule],
    controllers: [AdminBannerController],
    providers: [
        ListActiveBannersUseCase,
        ListAllBannersUseCase,
    ],
    exports: [ListActiveBannersUseCase, ListAllBannersUseCase],
})
export class BannerModule { }