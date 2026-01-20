
import { Module } from '@nestjs/common';
import { CONTEXT_REPOSITORY } from './repositories/context.repository.interface';
import { GROUP_REPOSITORY } from './repositories/group.repository.interface';
import { ContextPrismaRepository } from './repositories/context.prisma.repository';
import { GroupPrismaRepository } from './repositories/group.prisma.repository';

@Module({
    providers: [
        {
            provide: CONTEXT_REPOSITORY,
            useClass: ContextPrismaRepository,
        },
        {
            provide: GROUP_REPOSITORY,
            useClass: GroupPrismaRepository,
        },
    ],
    exports: [CONTEXT_REPOSITORY, GROUP_REPOSITORY],
})
export class ContextRepositoryModule { }
