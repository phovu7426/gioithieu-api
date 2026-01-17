import { Module } from '@nestjs/common';
import { PartnerService } from '@/modules/introduction/partner/admin/services/partner.service';
import { PartnerController } from '@/modules/introduction/partner/admin/controllers/partner.controller';
import { RbacModule } from '@/modules/rbac/rbac.module';

@Module({
  imports: [
    RbacModule,
  ],
  controllers: [PartnerController],
  providers: [PartnerService],
  exports: [PartnerService],
})
export class AdminPartnerModule { }

