import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublicTestimonialService } from '@/modules/testimonial/public/testimonial/services/testimonial.service';
import { prepareQuery } from '@/common/base/utils/list-query.helper';

@Controller('testimonials')
export class PublicTestimonialController {
  constructor(private readonly testimonialService: PublicTestimonialService) {}

  @Get()
  findAll(@Query() query: any) {
    const { filters, options } = prepareQuery(query);
    return this.testimonialService.getList(filters, options);
  }

  @Get('featured')
  getFeatured(@Query('limit') limit?: number) {
    return this.testimonialService.getFeatured(limit ? Number(limit) : 10);
  }

  @Get('project/:projectId')
  findByProject(@Param('projectId') projectId: string) {
    return this.testimonialService.findByProject(Number(projectId));
  }
}

