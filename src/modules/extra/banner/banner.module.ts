import { Module } from '@nestjs/common';

// Import admin modules
import { AdminBannerModule } from '@/modules/extra/banner/admin/banner.module';
import { AdminBannerLocationModule } from '@/modules/extra/banner/admin/banner-location.module';

// Import public modules
import { PublicBannerModule } from '@/modules/extra/banner/public/banner.module';

@Module({
    imports: [
        // Admin modules
        AdminBannerModule,
        AdminBannerLocationModule,
        // Public modules
        PublicBannerModule,
    ],
    exports: [],
})
export class BannerModule { }