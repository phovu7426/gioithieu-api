
import { Module, Global } from '@nestjs/common';
import { PrismaModule } from '@/core/database/prisma/prisma.module';
import { MenuPrismaRepository } from './repositories/menu.prisma.repository';
import { MENU_REPOSITORY } from './repositories/menu.repository.interface';

@Global()
@Module({
    imports: [PrismaModule],
    providers: [
        {
            provide: MENU_REPOSITORY,
            useClass: MenuPrismaRepository,
        },
    ],
    exports: [MENU_REPOSITORY],
})
export class MenuRepositoryModule { }
