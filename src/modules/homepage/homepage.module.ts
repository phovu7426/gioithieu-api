import { Module } from '@nestjs/common';
import { HomepageController } from '@/modules/homepage/controllers/homepage.controller';
import { HomepageService } from '@/modules/homepage/services/homepage.service';
import { PublicProjectModule } from '@/modules/project/public/project/project.module';
import { PublicAboutModule } from '@/modules/about/public/about/about.module';
import { PublicStaffModule } from '@/modules/staff/public/staff/staff.module';
import { PublicTestimonialModule } from '@/modules/testimonial/public/testimonial/testimonial.module';
import { PublicPartnerModule } from '@/modules/partner/public/partner/partner.module';
import { PublicGalleryModule } from '@/modules/gallery/public/gallery/gallery.module';
import { PublicCertificateModule } from '@/modules/certificate/public/certificate/certificate.module';
import { PublicFaqModule } from '@/modules/faq/public/faq/faq.module';

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

