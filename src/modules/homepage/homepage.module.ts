import { Module } from '@nestjs/common';
import { HomepageController } from '@/modules/homepage/controllers/homepage.controller';
import { HomepageService } from '@/modules/homepage/services/homepage.service';
import { PublicProjectModule } from '@/modules/introduction/project/public/project/project.module';
import { PublicAboutModule } from '@/modules/common/about/public/about/about.module';
import { PublicStaffModule } from '@/modules/introduction/staff/public/staff/staff.module';
import { PublicTestimonialModule } from '@/modules/introduction/testimonial/public/testimonial/testimonial.module';
import { PublicPartnerModule } from '@/modules/introduction/partner/public/partner/partner.module';
import { PublicGalleryModule } from '@/modules/introduction/gallery/public/gallery/gallery.module';
import { PublicCertificateModule } from '@/modules/introduction/certificate/public/certificate/certificate.module';
import { PublicFaqModule } from '@/modules/common/faq/public/faq/faq.module';

@Module({
  imports: [
    // CommonModule là @Global() nên không cần import
    PublicProjectModule,
    PublicAboutModule,
    PublicStaffModule,
    PublicTestimonialModule,
    PublicPartnerModule,
    PublicGalleryModule,
    PublicCertificateModule,
    PublicFaqModule,
  ],
  controllers: [HomepageController],
  providers: [HomepageService],
  exports: [HomepageService],
})
export class HomepageModule {}

