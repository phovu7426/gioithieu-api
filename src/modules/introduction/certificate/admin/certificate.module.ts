import { Module } from '@nestjs/common';
import { CertificateService } from '@/modules/introduction/certificate/admin/services/certificate.service';
import { CertificateController } from '@/modules/introduction/certificate/admin/controllers/certificate.controller';
import { RbacModule } from '@/modules/rbac/rbac.module';

@Module({
  imports: [
    RbacModule,
  ],
  controllers: [CertificateController],
  providers: [CertificateService],
  exports: [CertificateService],
})
export class AdminCertificateModule { }

