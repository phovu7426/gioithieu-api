import { Module } from '@nestjs/common';
import { PublicBannerService } from '@/modules/extra/banner/public/services/banner.service';
import { PublicBannerController } from '@/modules/extra/banner/public/controllers/banner.controller';

@Module({
    imports: [],
    controllers: [PublicBannerController],
    providers: [PublicBannerService],
    exports: [PublicBannerService],
})
export class PublicBannerModule { }