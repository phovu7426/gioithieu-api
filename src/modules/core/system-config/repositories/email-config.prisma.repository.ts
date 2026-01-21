
import { Injectable } from '@nestjs/common';
import { EmailConfig, Prisma } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { PrismaRepository } from '@/common/base/repository/prisma.repository';
import { IEmailConfigRepository, EmailConfigFilter } from './email-config.repository.interface';

@Injectable()
export class EmailConfigPrismaRepository extends PrismaRepository<
    EmailConfig,
    Prisma.EmailConfigWhereInput,
    Prisma.EmailConfigCreateInput,
    Prisma.EmailConfigUpdateInput,
    Prisma.EmailConfigOrderByWithRelationInput
> implements IEmailConfigRepository {
    constructor(private readonly prisma: PrismaService) {
        super(prisma.emailConfig as unknown as any);
    }

    protected buildWhere(filter: EmailConfigFilter): Prisma.EmailConfigWhereInput {
        const where: Prisma.EmailConfigWhereInput = {};
        where.deleted_at = null;
        return where;
    }

    async getConfig(): Promise<EmailConfig | null> {
        return this.prisma.emailConfig.findFirst({
            where: { deleted_at: null },
            orderBy: { created_at: 'desc' },
        });
    }
}
