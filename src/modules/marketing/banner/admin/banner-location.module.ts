import { Module } from '@nestjs/common';
import { BannerLocationService } from '@/modules/marketing/banner/admin/services/banner-location.service';
import { BannerLocationController } from '@/modules/marketing/banner/admin/controllers/banner-location.controller';
import { RbacModule } from '@/modules/core/rbac/rbac.module';

import { BannerRepositoryModule } from '@/modules/marketing/banner/banner.repository.module';

@Module({
    imports: [
        RbacModule,
        BannerRepositoryModule,
    ],
    controllers: [BannerLocationController],
    providers: [BannerLocationService],
    exports: [BannerLocationService],
})
export class AdminBannerLocationModule { }