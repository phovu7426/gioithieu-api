import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { AdminCertificateController } from '@/modules/introduction/certificate/admin/controllers/certificate.controller';
import { RbacModule } from '@/modules/core/rbac/rbac.module';
import { CertificateRepositoryModule } from '@/infrastructure/persistence/prisma/repositories/certificate-repository.module';
import { CreateCertificateUseCase } from '@/application/use-cases/certificate/commands/create-certificate/create-certificate.usecase';
import { UpdateCertificateUseCase } from '@/application/use-cases/certificate/commands/update-certificate/update-certificate.usecase';
import { DeleteCertificateUseCase } from '@/application/use-cases/certificate/commands/delete-certificate/delete-certificate.usecase';
import { GetCertificateUseCase } from '@/application/use-cases/certificate/queries/admin/get-certificate/get-certificate.usecase';
import { ListCertificatesUseCase } from '@/application/use-cases/certificate/queries/admin/list-certificates/list-certificates.usecase';
=======
import { CertificateService } from '@/modules/introduction/certificate/admin/services/certificate.service';
import { CertificateController } from '@/modules/introduction/certificate/admin/controllers/certificate.controller';
import { RbacModule } from '@/modules/rbac/rbac.module';
import { CertificateRepositoryModule } from '../certificate.repository.module';
>>>>>>> parent of cf58bf3 (fix repo)

@Module({
  imports: [
    RbacModule,
    CertificateRepositoryModule,
  ],
  controllers: [AdminCertificateController],
  providers: [
    CreateCertificateUseCase,
    UpdateCertificateUseCase,
    DeleteCertificateUseCase,
    GetCertificateUseCase,
    ListCertificatesUseCase,
  ],
  exports: [
    CreateCertificateUseCase,
    UpdateCertificateUseCase,
    DeleteCertificateUseCase,
    GetCertificateUseCase,
    ListCertificatesUseCase,
  ],
})
export class AdminCertificateModule { }
