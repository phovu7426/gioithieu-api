import { Module } from '@nestjs/common';
import { CertificatePrismaRepository } from './certificate.prisma.repository';
import { CertificateMapper } from '../mappers/certificate.mapper';
import { PrismaModule } from '@/core/database/prisma/prisma.module';

/**
 * Certificate Repository Module
 * Provides the certificate repository implementation
 */
@Module({
    imports: [PrismaModule],
    providers: [
        CertificateMapper,
        {
            provide: 'ICertificateRepository',
            useClass: CertificatePrismaRepository,
        },
    ],
    exports: ['ICertificateRepository'],
})
export class CertificateRepositoryModule { }
