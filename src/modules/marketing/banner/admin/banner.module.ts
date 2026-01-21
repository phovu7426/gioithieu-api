import { Module } from '@nestjs/common';
import { BannerService } from '@/modules/marketing/banner/admin/services/banner.service';
import { BannerController } from '@/modules/marketing/banner/admin/controllers/banner.controller';
import { RbacModule } from '@/modules/core/rbac/rbac.module';

import { BannerRepositoryModule } from '@/modules/marketing/banner/banner.repository.module';

@Module({
    imports: [
        RbacModule,
        BannerRepositoryModule,
    ],
    controllers: [BannerController],
    providers: [BannerService],
    exports: [BannerService],
})
export class AdminBannerModule { }