import { Module } from '@nestjs/common';
import { PublicCertificateController } from '@/modules/introduction/certificate/public/controllers/certificate.controller';
<<<<<<< HEAD
import { CertificateRepositoryModule } from '@/infrastructure/persistence/prisma/repositories/certificate-repository.module';
import { GetPublicCertificateUseCase } from '@/application/use-cases/certificate/queries/public/get-certificate/get-public-certificate.usecase';
import { ListPublicCertificatesUseCase } from '@/application/use-cases/certificate/queries/public/list-certificates/list-public-certificates.usecase';
=======
>>>>>>> parent of cf58bf3 (fix repo)

@Module({
  imports: [],
  controllers: [PublicCertificateController],
  providers: [
    GetPublicCertificateUseCase,
    ListPublicCertificatesUseCase,
  ],
  exports: [
    GetPublicCertificateUseCase,
    ListPublicCertificatesUseCase,
  ],
})
export class PublicCertificateModule { }
