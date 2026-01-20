
import { Module, Global } from '@nestjs/common';
import { PrismaModule } from '@/core/database/prisma/prisma.module';
import { ProjectPrismaRepository } from './repositories/project.prisma.repository';
import { PROJECT_REPOSITORY } from './repositories/project.repository.interface';

@Global()
@Module({
    imports: [PrismaModule],
    providers: [
        {
            provide: PROJECT_REPOSITORY,
            useClass: ProjectPrismaRepository,
        },
    ],
    exports: [PROJECT_REPOSITORY],
})
export class ProjectRepositoryModule { }
