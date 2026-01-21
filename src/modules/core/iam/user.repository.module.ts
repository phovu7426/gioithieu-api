
import { Global, Module, Provider } from '@nestjs/common';
import { PrismaModule } from '@/core/database/prisma/prisma.module';
import { UserPrismaRepository } from './repositories/user.prisma.repository';
import { USER_REPOSITORY } from './repositories/user.repository.interface';
import { RolePrismaRepository } from './repositories/role.prisma.repository';
import { ROLE_REPOSITORY } from './repositories/role.repository.interface';
import { PermissionPrismaRepository } from './repositories/permission.prisma.repository';
import { PERMISSION_REPOSITORY } from './repositories/permission.repository.interface';

const repositories: Provider[] = [
    {
        provide: USER_REPOSITORY,
        useClass: UserPrismaRepository,
    },
    {
        provide: ROLE_REPOSITORY,
        useClass: RolePrismaRepository,
    },
    {
        provide: PERMISSION_REPOSITORY,
        useClass: PermissionPrismaRepository,
    },
];

@Global()
@Module({
    imports: [PrismaModule],
    providers: [...repositories],
    exports: [...repositories],
})
export class UserRepositoryModule { }
