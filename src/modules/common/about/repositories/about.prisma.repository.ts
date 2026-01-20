import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { PrismaRepository } from '@/common/base/repository/prisma.repository';
import { IAboutRepository, AboutFilter } from './about.repository.interface';

@Injectable()
export class AboutPrismaRepository extends PrismaRepository<any> implements IAboutRepository {
    constructor(prisma: PrismaService) {
        super(prisma.aboutSection);
    }

    protected buildWhere(filter: AboutFilter): any {
        const where: any = { deleted_at: null };

        if (filter.search) {
            where.OR = [
                { title: { contains: filter.search } },
                { content: { contains: filter.search } },
            ];
        }

        if (filter.section_type) {
            where.section_type = filter.section_type;
        }

        if (filter.status) {
            where.status = filter.status;
        }

        return where;
    }

    async findBySlug(slug: string): Promise<any | null> {
        return this.delegate.findFirst({
            where: {
                slug,
                deleted_at: null,
                status: 'active' as any,
            },
        });
    }
}
