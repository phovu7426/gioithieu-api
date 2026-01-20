
import { Module, Global } from '@nestjs/common';
import { PrismaModule } from '@/core/database/prisma/prisma.module';
import { ContactPrismaRepository } from './repositories/contact.prisma.repository';
import { CONTACT_REPOSITORY } from './repositories/contact.repository.interface';

@Global()
@Module({
    imports: [PrismaModule],
    providers: [
        {
            provide: CONTACT_REPOSITORY,
            useClass: ContactPrismaRepository,
        },
    ],
    exports: [CONTACT_REPOSITORY],
})
export class ContactRepositoryModule { }
