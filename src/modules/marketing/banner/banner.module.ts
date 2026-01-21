import { Module } from '@nestjs/common';

// Import admin modules
import { AdminBannerModule } from '@/modules/marketing/banner/admin/banner.module';
import { AdminBannerLocationModule } from '@/modules/marketing/banner/admin/banner-location.module';

// Import public modules
import { PublicBannerModule } from '@/modules/marketing/banner/public/banner.module';
import { BannerRepositoryModule } from './banner.repository.module';

@Module({
    imports: [
        BannerRepositoryModule,
        // Admin modules
        AdminBannerModule,
        AdminBannerLocationModule,
        // Public modules
        PublicBannerModule,
    ],
    exports: [],
})
export class BannerModule { }