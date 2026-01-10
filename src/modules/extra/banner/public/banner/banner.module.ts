import { Module } from '@nestjs/common';
import { PublicBannerService } from '@/modules/extra/banner/public/banner/services/banner.service';
import { PublicBannerController } from '@/modules/extra/banner/public/banner/controllers/banner.controller';

@Module({
    imports: [],
    controllers: [PublicBannerController],
    providers: [PublicBannerService],
    exports: [PublicBannerService],
})
export class PublicBannerModule { }