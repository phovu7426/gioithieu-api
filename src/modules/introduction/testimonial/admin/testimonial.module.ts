import { Module } from '@nestjs/common';
import { TestimonialController } from '@/modules/introduction/testimonial/admin/controllers/testimonial.controller';
<<<<<<< HEAD
import { RbacModule } from '@/modules/core/rbac/rbac.module';
import { IntroductionRepositoryModule } from '@/infrastructure/persistence/prisma/repositories/introduction-repository.module';
import { CreateTestimonialUseCase } from '@/application/use-cases/introduction/testimonial/commands/create-testimonial/create-testimonial.usecase';
import { UpdateTestimonialUseCase } from '@/application/use-cases/introduction/testimonial/commands/update-testimonial/update-testimonial.usecase';
import { DeleteTestimonialUseCase } from '@/application/use-cases/introduction/testimonial/commands/delete-testimonial/delete-testimonial.usecase';
import { ToggleTestimonialFeaturedUseCase } from '@/application/use-cases/introduction/testimonial/commands/toggle-featured/toggle-featured.usecase';
import { ListTestimonialsUseCase } from '@/application/use-cases/introduction/testimonial/queries/admin/list-testimonials.usecase';
import { GetTestimonialUseCase } from '@/application/use-cases/introduction/testimonial/queries/admin/get-testimonial.usecase';
=======
import { RbacModule } from '@/modules/rbac/rbac.module';
>>>>>>> parent of cf58bf3 (fix repo)

@Module({
  imports: [
    RbacModule,
<<<<<<< HEAD
    IntroductionRepositoryModule,
=======
>>>>>>> parent of cf58bf3 (fix repo)
  ],
  controllers: [TestimonialController],
  providers: [
    ListTestimonialsUseCase,
    GetTestimonialUseCase,
    CreateTestimonialUseCase,
    UpdateTestimonialUseCase,
    DeleteTestimonialUseCase,
    ToggleTestimonialFeaturedUseCase,
  ],
  exports: [
    ListTestimonialsUseCase,
    GetTestimonialUseCase,
    CreateTestimonialUseCase,
    UpdateTestimonialUseCase,
    DeleteTestimonialUseCase,
    ToggleTestimonialFeaturedUseCase,
  ],
})
export class AdminTestimonialModule { }

