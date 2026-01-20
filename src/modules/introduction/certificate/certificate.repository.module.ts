
import { Module } from '@nestjs/common';
import { CERTIFICATE_REPOSITORY } from './repositories/certificate.repository.interface';
import { CertificatePrismaRepository } from './repositories/certificate.prisma.repository';

@Module({
    providers: [
        {
            provide: CERTIFICATE_REPOSITORY,
            useClass: CertificatePrismaRepository,
        },
    ],
    exports: [CERTIFICATE_REPOSITORY],
})
export class CertificateRepositoryModule { }
