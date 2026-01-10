import { Module } from '@nestjs/common';

// Import admin modules
import { AdminProjectModule } from '@/modules/project/admin/project/project.module';

// Import public modules
import { PublicProjectModule } from '@/modules/project/public/project/project.module';

@Module({
  imports: [
    // Admin modules
    AdminProjectModule,
    // Public modules
    PublicProjectModule,
  ],
  exports: [],
})
export class ProjectModule {}

