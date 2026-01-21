import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/database/prisma/prisma.module';
import { UserPrismaRepository } from './user.prisma.repository';
import { UserProfilePrismaRepository } from './user-profile.prisma.repository';
import { UserMapper } from '../mappers/user.mapper';
import { UserProfileMapper } from '../mappers/user-profile.mapper';

@Module({
    imports: [PrismaModule],
    providers: [
        UserMapper,
        UserProfileMapper,
        { provide: 'IUserRepository', useClass: UserPrismaRepository },
        { provide: 'IProfileRepository', useClass: UserProfilePrismaRepository },
    ],
    exports: ['IUserRepository', 'IProfileRepository'],
})
export class UserRepositoryModule { }
