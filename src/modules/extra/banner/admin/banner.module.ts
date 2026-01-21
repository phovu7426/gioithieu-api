import { Module } from '@nestjs/common';
import { BannerService } from '@/modules/extra/banner/admin/services/banner.service';
import { BannerController } from '@/modules/extra/banner/admin/controllers/banner.controller';
import { RbacModule } from '@/modules/rbac/rbac.module';

import { BannerRepositoryModule } from '../banner.repository.module';

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