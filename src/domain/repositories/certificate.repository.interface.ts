import { IBaseRepository } from '@/common/base/repository/base.repository.interface';
import { Certificate } from '@/domain/models/certificate.model';

/**
 * Certificate Repository Interface
 * Defines domain-specific queries for certificates
 * Completely ORM-agnostic
 */
export interface ICertificateRepository extends IBaseRepository<Certificate, bigint> {
    /**
     * Find all active certificates
     */
    findActive(): Promise<Certificate[]>;

    /**
     * Find certificates by status
     */
    findByStatus(status: string): Promise<Certificate[]>;

    /**
     * Find certificates by type
     */
    findByType(type: string): Promise<Certificate[]>;

    /**
     * Find certificates with pagination and filtering
     */
    findWithPagination(options: {
        page: number;
        limit: number;
        status?: string;
        type?: string;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        items: Certificate[];
        total: number;
        page: number;
        limit: number;
        lastPage: number;
    }>;

    /**
     * Check if certificate number already exists
     */
    existsByCertificateNumber(certificateNumber: string, excludeId?: bigint): Promise<boolean>;
}
