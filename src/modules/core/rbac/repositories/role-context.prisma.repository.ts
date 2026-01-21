
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { RoleContext } from '@prisma/client';
import { IRoleContextRepository } from './role-context.repository.interface';

@Injectable()
export class RoleContextPrismaRepository implements IRoleContextRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findFirst(options: {
        where?: any;
    }): Promise<RoleContext | null> {
        return this.prisma.roleContext.findFirst(options);
    }
}
