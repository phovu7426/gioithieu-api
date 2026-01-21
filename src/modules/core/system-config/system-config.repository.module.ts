
import { Module } from '@nestjs/common';
import { GENERAL_CONFIG_REPOSITORY } from './repositories/general-config.repository.interface';
import { GeneralConfigPrismaRepository } from './repositories/general-config.prisma.repository';
import { EMAIL_CONFIG_REPOSITORY } from './repositories/email-config.repository.interface';
import { EmailConfigPrismaRepository } from './repositories/email-config.prisma.repository';

@Module({
    providers: [
        {
            provide: GENERAL_CONFIG_REPOSITORY,
            useClass: GeneralConfigPrismaRepository,
        },
        {
            provide: EMAIL_CONFIG_REPOSITORY,
            useClass: EmailConfigPrismaRepository,
        },
    ],
    exports: [GENERAL_CONFIG_REPOSITORY, EMAIL_CONFIG_REPOSITORY],
})
export class SystemConfigRepositoryModule { }
