import { Module } from '@nestjs/common';
import { PublicBannerService } from '@/modules/marketing/banner/public/services/banner.service';
import { PublicBannerController } from '@/modules/marketing/banner/public/controllers/banner.controller';

import { BannerRepositoryModule } from '@/modules/marketing/banner/banner.repository.module';

@Module({
    imports: [BannerRepositoryModule],
    controllers: [PublicBannerController],
    providers: [PublicBannerService],
    exports: [PublicBannerService],
})
export class PublicBannerModule { }