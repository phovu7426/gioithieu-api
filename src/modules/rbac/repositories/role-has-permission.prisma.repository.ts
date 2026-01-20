
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { RoleHasPermission } from '@prisma/client';
import { IRoleHasPermissionRepository } from './role-has-permission.repository.interface';

@Injectable()
export class RoleHasPermissionPrismaRepository implements IRoleHasPermissionRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findMany(options: {
        where?: any;
        include?: any;
    }): Promise<RoleHasPermission[]> {
        return this.prisma.roleHasPermission.findMany(options);
    }
}
