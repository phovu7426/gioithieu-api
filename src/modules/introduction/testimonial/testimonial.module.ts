import { Module } from '@nestjs/common';

// Import admin modules
import { AdminTestimonialModule } from '@/modules/introduction/testimonial/admin/testimonial/testimonial.module';

// Import public modules
import { PublicTestimonialModule } from '@/modules/introduction/testimonial/public/testimonial/testimonial.module';

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

