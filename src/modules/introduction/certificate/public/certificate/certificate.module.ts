import { Module } from '@nestjs/common';
import { PublicCertificateService } from '@/modules/introduction/certificate/public/certificate/services/certificate.service';
import { PublicCertificateController } from '@/modules/introduction/certificate/public/certificate/controllers/certificate.controller';

@Module({
  imports: [],
  controllers: [PublicCertificateController],
  providers: [PublicCertificateService],
  exports: [PublicCertificateService],
})
export class PublicCertificateModule { }

