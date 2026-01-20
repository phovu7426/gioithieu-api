
import { Module } from '@nestjs/common';
import { FAQ_REPOSITORY } from './repositories/faq.repository.interface';
import { FaqPrismaRepository } from './repositories/faq.prisma.repository';

@Module({
    providers: [
        {
            provide: FAQ_REPOSITORY,
            useClass: FaqPrismaRepository,
        },
    ],
    exports: [FAQ_REPOSITORY],
})
export class FaqRepositoryModule { }
