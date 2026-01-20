import { Module } from '@nestjs/common';
import { RbacCacheService } from '@/modules/rbac/services/rbac-cache.service';
import { RbacService } from '@/modules/rbac/services/rbac.service';
import { RbacController } from '@/modules/rbac/controllers/rbac.controller';

import { ContextRepositoryModule } from '@/modules/context/context.repository.module';
import { RbacRepositoryModule } from './rbac.repository.module';

@Module({
  imports: [ContextRepositoryModule, RbacRepositoryModule],
  providers: [RbacService, RbacCacheService],
  controllers: [RbacController],
  exports: [RbacService, RbacCacheService],
})
export class RbacModule { }

