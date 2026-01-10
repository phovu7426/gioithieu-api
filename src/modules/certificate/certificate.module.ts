import { Module } from '@nestjs/common';

// Import admin modules
import { AdminCertificateModule } from '@/modules/certificate/admin/certificate/certificate.module';

// Import public modules
import { PublicCertificateModule } from '@/modules/certificate/public/certificate/certificate.module';

@Module({
  imports: [
    // Admin modules
    AdminCertificateModule,
    // Public modules
    PublicCertificateModule,
  ],
  exports: [],
})
export class CertificateModule {}

