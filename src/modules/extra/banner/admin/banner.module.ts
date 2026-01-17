import { Module } from '@nestjs/common';
import { BannerService } from '@/modules/extra/banner/admin/services/banner.service';
import { BannerController } from '@/modules/extra/banner/admin/controllers/banner.controller';
import { RbacModule } from '@/modules/rbac/rbac.module';

@Module({
    imports: [
        RbacModule,
    ],
    controllers: [BannerController],
    providers: [BannerService],
    exports: [BannerService],
})
export class AdminBannerModule { }