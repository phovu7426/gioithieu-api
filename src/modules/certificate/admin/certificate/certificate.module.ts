import { Module } from '@nestjs/common';
import { CertificateService } from '@/modules/certificate/admin/certificate/services/certificate.service';
import { CertificateController } from '@/modules/certificate/admin/certificate/controllers/certificate.controller';
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

