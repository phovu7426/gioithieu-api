
import { Injectable } from '@nestjs/common';
import { GeneralConfig, Prisma } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { PrismaRepository } from '@/common/base/repository/prisma.repository';
import { IGeneralConfigRepository, GeneralConfigFilter } from './general-config.repository.interface';

@Injectable()
export class GeneralConfigPrismaRepository extends PrismaRepository<
    GeneralConfig,
    Prisma.GeneralConfigWhereInput,
    Prisma.GeneralConfigCreateInput,
    Prisma.GeneralConfigUpdateInput,
    Prisma.GeneralConfigOrderByWithRelationInput
> implements IGeneralConfigRepository {
    constructor(private readonly prisma: PrismaService) {
        super(prisma.generalConfig as unknown as any);
    }

    protected buildWhere(filter: GeneralConfigFilter): Prisma.GeneralConfigWhereInput {
        const where: Prisma.GeneralConfigWhereInput = {};
        where.deleted_at = null;
        return where;
    }

    async getConfig(): Promise<GeneralConfig | null> {
        return this.prisma.generalConfig.findFirst({
            where: { deleted_at: null },
            orderBy: { created_at: 'desc' },
        });
    }
}
