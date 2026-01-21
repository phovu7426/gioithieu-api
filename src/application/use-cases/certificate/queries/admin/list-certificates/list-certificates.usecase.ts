import { Injectable, Inject } from '@nestjs/common';
import { ICertificateRepository } from '@/domain/repositories/certificate.repository.interface';
import { AdminCertificateResponseDto } from '../get-certificate/admin-certificate.response.dto';
import { ListCertificatesQuery } from './list-certificates.query';

export interface ListCertificatesResponse {
    data: AdminCertificateResponseDto[];
    meta: {
        page: number;
        limit: number;
        total: number;
        lastPage: number;
    };
}

/**
 * List Certificates Use Case (Admin)
 * Retrieves a paginated list of certificates for admin users
 */
@Injectable()
export class ListCertificatesUseCase {
    constructor(
        @Inject('ICertificateRepository')
        private readonly certificateRepo: ICertificateRepository,
    ) { }

    async execute(query: ListCertificatesQuery): Promise<ListCertificatesResponse> {
        const result = await this.certificateRepo.findWithPagination({
            page: query.page || 1,
            limit: query.limit || 10,
            status: query.status,
            type: query.type,
            search: query.search,
            sortBy: query.sortBy || 'sort_order',
            sortOrder: query.sortOrder || 'asc',
        });

        return {
            data: result.items.map((cert) => AdminCertificateResponseDto.fromDomain(cert)),
            meta: {
                page: result.page,
                limit: result.limit,
                total: result.total,
                lastPage: result.lastPage,
            },
        };
    }
}
