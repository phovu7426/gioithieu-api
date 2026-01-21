import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/database/prisma/prisma.module';
import {
    RolePrismaRepository, PermissionPrismaRepository,
    GeneralConfigPrismaRepository, EmailConfigPrismaRepository,
    MenuPrismaRepository
} from './core-system.prisma.repository';
import { RoleMapper, PermissionMapper } from '../mappers/rbac.mapper';
import { SystemMapper, EmailConfigMapper, MenuMapper } from '../mappers/system.mapper';

@Module({
    imports: [PrismaModule],
    providers: [
        RoleMapper, PermissionMapper, SystemMapper, EmailConfigMapper, MenuMapper,
        { provide: 'IRoleRepository', useClass: RolePrismaRepository },
        { provide: 'IPermissionRepository', useClass: PermissionPrismaRepository },
        { provide: 'IGeneralConfigRepository', useClass: GeneralConfigPrismaRepository },
        { provide: 'IEmailConfigRepository', useClass: EmailConfigPrismaRepository },
        { provide: 'IMenuRepository', useClass: MenuPrismaRepository },
    ],
    exports: [
        'IRoleRepository', 'IPermissionRepository',
        'IGeneralConfigRepository', 'IEmailConfigRepository',
        'IMenuRepository'
    ],
})
export class CoreSystemRepositoryModule { }
