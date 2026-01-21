
import { Module } from '@nestjs/common';
import { USER_GROUP_REPOSITORY } from './repositories/user-group.repository.interface';
import { UserGroupPrismaRepository } from './repositories/user-group.prisma.repository';
import { USER_ROLE_ASSIGNMENT_REPOSITORY } from './repositories/user-role-assignment.repository.interface';
import { UserRoleAssignmentPrismaRepository } from './repositories/user-role-assignment.prisma.repository';
import { ROLE_HAS_PERMISSION_REPOSITORY } from './repositories/role-has-permission.repository.interface';
import { RoleHasPermissionPrismaRepository } from './repositories/role-has-permission.prisma.repository';
import { ROLE_CONTEXT_REPOSITORY } from './repositories/role-context.repository.interface';
import { RoleContextPrismaRepository } from './repositories/role-context.prisma.repository';

@Module({
    providers: [
        {
            provide: USER_GROUP_REPOSITORY,
            useClass: UserGroupPrismaRepository,
        },
        {
            provide: USER_ROLE_ASSIGNMENT_REPOSITORY,
            useClass: UserRoleAssignmentPrismaRepository,
        },
        {
            provide: ROLE_HAS_PERMISSION_REPOSITORY,
            useClass: RoleHasPermissionPrismaRepository,
        },
        {
            provide: ROLE_CONTEXT_REPOSITORY,
            useClass: RoleContextPrismaRepository,
        },
    ],
    exports: [
        USER_GROUP_REPOSITORY,
        USER_ROLE_ASSIGNMENT_REPOSITORY,
        ROLE_HAS_PERMISSION_REPOSITORY,
        ROLE_CONTEXT_REPOSITORY,
    ],
})
export class RbacRepositoryModule { }
