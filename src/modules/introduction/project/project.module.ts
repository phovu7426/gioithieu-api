import { Module } from '@nestjs/common';

// Import admin modules
import { AdminProjectModule } from '@/modules/introduction/project/admin/project.module';

// Import public modules
import { PublicProjectModule } from '@/modules/introduction/project/public/project.module';

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

