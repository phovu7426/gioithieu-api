import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/database/prisma/prisma.module';
import { StaffPrismaRepository } from './staff.prisma.repository';
import { ProjectPrismaRepository } from './project.prisma.repository';
import {
    GalleryPrismaRepository, PartnerPrismaRepository,
    FaqPrismaRepository, TestimonialPrismaRepository
} from './intro-group.prisma.repository';
import { ContactPrismaRepository, AboutSectionPrismaRepository } from './intro-extended.prisma.repository';
import { StaffMapper } from '../mappers/staff.mapper';
import { ProjectMapper } from '../mappers/project.mapper';
import { GalleryMapper, PartnerMapper, FaqMapper, TestimonialMapper } from '../mappers/intro-group.mapper';
import { ContactMapper, AboutSectionMapper } from '../mappers/intro-extended.mapper';

@Module({
    imports: [PrismaModule],
    providers: [
        StaffMapper, ProjectMapper, GalleryMapper, PartnerMapper, FaqMapper, TestimonialMapper,
        ContactMapper, AboutSectionMapper,
        { provide: 'IStaffRepository', useClass: StaffPrismaRepository },
        { provide: 'IProjectRepository', useClass: ProjectPrismaRepository },
        { provide: 'IGalleryRepository', useClass: GalleryPrismaRepository },
        { provide: 'IPartnerRepository', useClass: PartnerPrismaRepository },
        { provide: 'IFaqRepository', useClass: FaqPrismaRepository },
        { provide: 'ITestimonialRepository', useClass: TestimonialPrismaRepository },
        { provide: 'IContactRepository', useClass: ContactPrismaRepository },
        { provide: 'IAboutSectionRepository', useClass: AboutSectionPrismaRepository },
    ],
    exports: [
        'IStaffRepository', 'IProjectRepository', 'IGalleryRepository',
        'IPartnerRepository', 'IFaqRepository', 'ITestimonialRepository',
        'IContactRepository', 'IAboutSectionRepository'
    ],
})
export class IntroductionRepositoryModule { }
