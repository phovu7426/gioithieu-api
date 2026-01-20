
import { Module, Global } from '@nestjs/common';
import { PrismaModule } from '@/core/database/prisma/prisma.module';
import { TestimonialPrismaRepository } from './repositories/testimonial.prisma.repository';
import { TESTIMONIAL_REPOSITORY } from './repositories/testimonial.repository.interface';

@Global()
@Module({
    imports: [PrismaModule],
    providers: [
        {
            provide: TESTIMONIAL_REPOSITORY,
            useClass: TestimonialPrismaRepository,
        },
    ],
    exports: [TESTIMONIAL_REPOSITORY],
})
export class TestimonialRepositoryModule { }
