import { Module } from '@nestjs/common';

// Import admin modules
import { AdminTestimonialModule } from '@/modules/testimonial/admin/testimonial/testimonial.module';

// Import public modules
import { PublicTestimonialModule } from '@/modules/testimonial/public/testimonial/testimonial.module';

@Module({
  imports: [
    // Admin modules
    AdminTestimonialModule,
    // Public modules
    PublicTestimonialModule,
  ],
  exports: [],
})
export class TestimonialModule {}

