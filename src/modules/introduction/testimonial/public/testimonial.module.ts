import { Module } from '@nestjs/common';
import { PublicTestimonialController } from '@/modules/introduction/testimonial/public/controllers/testimonial.controller';
import { IntroductionRepositoryModule } from '@/infrastructure/persistence/prisma/repositories/introduction-repository.module';
import { ListActiveTestimonialsUseCase } from '@/application/use-cases/introduction/testimonial/queries/public/list-active-testimonials.usecase';
import { ListFeaturedTestimonialsUseCase } from '@/application/use-cases/introduction/testimonial/queries/public/list-featured-testimonials.usecase';
import { ListProjectTestimonialsUseCase } from '@/application/use-cases/introduction/testimonial/queries/public/list-project-testimonials.usecase';

@Module({
  imports: [IntroductionRepositoryModule],
  controllers: [PublicTestimonialController],
  providers: [
    ListActiveTestimonialsUseCase,
    ListFeaturedTestimonialsUseCase,
    ListProjectTestimonialsUseCase,
  ],
  exports: [
    ListActiveTestimonialsUseCase,
    ListFeaturedTestimonialsUseCase,
    ListProjectTestimonialsUseCase,
  ],
})
export class PublicTestimonialModule { }

