
import { Certificate } from '@prisma/client';
import { IRepository } from '@/common/base/repository/repository.interface';

export const CERTIFICATE_REPOSITORY = 'ICertificateRepository';

export interface CertificateFilter {
    search?: string;
    status?: string;
}

export interface ICertificateRepository extends IRepository<Certificate> {
}
