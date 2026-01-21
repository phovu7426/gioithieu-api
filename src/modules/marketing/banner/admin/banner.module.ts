import { Module } from '@nestjs/common';
import { AdminBannerController } from './controllers/banner.controller';
import { MarketingRepositoryModule } from '@/infrastructure/persistence/prisma/repositories/marketing-repository.module';
import { ListAllBannersUseCase } from '@/application/use-cases/marketing/banner.usecases';

@Module({
    imports: [MarketingRepositoryModule],
    controllers: [AdminBannerController],
    providers: [ListAllBannersUseCase],
    exports: [ListAllBannersUseCase],
})
export class AdminBannerModule { }