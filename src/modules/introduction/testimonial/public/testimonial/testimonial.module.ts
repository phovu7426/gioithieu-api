import { Module } from '@nestjs/common';
import { PublicTestimonialService } from '@/modules/introduction/testimonial/public/testimonial/services/testimonial.service';
import { PublicTestimonialController } from '@/modules/introduction/testimonial/public/testimonial/controllers/testimonial.controller';

@Module({
  imports: [],
  controllers: [PublicTestimonialController],
  providers: [PublicTestimonialService],
  exports: [PublicTestimonialService],
})
export class PublicTestimonialModule { }

