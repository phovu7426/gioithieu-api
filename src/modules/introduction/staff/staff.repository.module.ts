
import { Module, Global } from '@nestjs/common';
import { PrismaModule } from '@/core/database/prisma/prisma.module';
import { StaffPrismaRepository } from './repositories/staff.prisma.repository';
import { STAFF_REPOSITORY } from './repositories/staff.repository.interface';

@Global()
@Module({
    imports: [PrismaModule],
    providers: [
        {
            provide: STAFF_REPOSITORY,
            useClass: StaffPrismaRepository,
        },
    ],
    exports: [STAFF_REPOSITORY],
})
export class StaffRepositoryModule { }
