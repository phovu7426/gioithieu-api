import { Module } from '@nestjs/common';
import { TestimonialService } from '@/modules/introduction/testimonial/admin/testimonial/services/testimonial.service';
import { TestimonialController } from '@/modules/introduction/testimonial/admin/testimonial/controllers/testimonial.controller';
import { RbacModule } from '@/modules/rbac/rbac.module';

@Module({
  imports: [
    RbacModule,
  ],
  controllers: [TestimonialController],
  providers: [TestimonialService],
  exports: [TestimonialService],
})
export class AdminTestimonialModule { }

