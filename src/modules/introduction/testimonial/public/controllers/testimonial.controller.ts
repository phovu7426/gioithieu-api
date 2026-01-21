import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ListActiveTestimonialsUseCase } from '@/application/use-cases/introduction/testimonial/queries/public/list-active-testimonials.usecase';
import { ListFeaturedTestimonialsUseCase } from '@/application/use-cases/introduction/testimonial/queries/public/list-featured-testimonials.usecase';
import { ListProjectTestimonialsUseCase } from '@/application/use-cases/introduction/testimonial/queries/public/list-project-testimonials.usecase';
import { Permission } from '@/common/decorators/rbac.decorators';

@ApiTags('Public / Testimonials')
@Controller('testimonials')
export class PublicTestimonialController {
  constructor(
    private readonly listActiveUseCase: ListActiveTestimonialsUseCase,
    private readonly listFeaturedUseCase: ListFeaturedTestimonialsUseCase,
    private readonly listProjectUseCase: ListProjectTestimonialsUseCase,
  ) { }

  @ApiOperation({ summary: 'List all active testimonials' })
  @Permission('public')
  @Get()
  findAll() {
    return this.listActiveUseCase.execute();
  }

  @ApiOperation({ summary: 'Get featured testimonials' })
  @Permission('public')
  @Get('featured')
  getFeatured(@Query('limit') limit?: number) {
    return this.listFeaturedUseCase.execute(limit ? Number(limit) : 10);
  }

  @ApiOperation({ summary: 'Find testimonials by project ID' })
  @Permission('public')
  @Get('project/:projectId')
  findByProject(@Param('projectId') projectId: string) {
    return this.listProjectUseCase.execute(BigInt(projectId));
  }
}

