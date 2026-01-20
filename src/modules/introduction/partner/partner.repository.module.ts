
import { Module, Global } from '@nestjs/common';
import { PrismaModule } from '@/core/database/prisma/prisma.module';
import { PartnerPrismaRepository } from './repositories/partner.prisma.repository';
import { PARTNER_REPOSITORY } from './repositories/partner.repository.interface';

@Global()
@Module({
    imports: [PrismaModule],
    providers: [
        {
            provide: PARTNER_REPOSITORY,
            useClass: PartnerPrismaRepository,
        },
    ],
    exports: [PARTNER_REPOSITORY],
})
export class PartnerRepositoryModule { }
