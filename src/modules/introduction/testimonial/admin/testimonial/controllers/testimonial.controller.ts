import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  Patch,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { TestimonialService } from '@/modules/introduction/testimonial/admin/testimonial/services/testimonial.service';
import { CreateTestimonialDto } from '@/modules/introduction/testimonial/admin/testimonial/dtos/create-testimonial.dto';
import { UpdateTestimonialDto } from '@/modules/introduction/testimonial/admin/testimonial/dtos/update-testimonial.dto';
import { prepareQuery } from '@/common/base/utils/list-query.helper';
import { LogRequest } from '@/common/decorators/log-request.decorator';
import { Permission } from '@/common/decorators/rbac.decorators';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RbacGuard } from '@/common/guards/rbac.guard';

@Controller('admin/testimonials')
@UseGuards(JwtAuthGuard, RbacGuard)
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}

  @LogRequest()
  @Post()
  @Permission('testimonial.manage')
  create(@Body(ValidationPipe) createTestimonialDto: CreateTestimonialDto) {
    return this.testimonialService.create(createTestimonialDto);
  }

  @Get()
  @Permission('testimonial.manage')
  findAll(@Query(ValidationPipe) query: any) {
    const { filters, options } = prepareQuery(query);
    return this.testimonialService.getList(filters, options);
  }

  @Get(':id')
  @Permission('testimonial.manage')
  findOne(@Param('id') id: string) {
    return this.testimonialService.getOne({ id: BigInt(id) } as any);
  }

  @Put(':id')
  @Permission('testimonial.manage')
  update(@Param('id') id: string, @Body(ValidationPipe) updateTestimonialDto: UpdateTestimonialDto) {
    return this.testimonialService.update({ id: BigInt(id) } as any, updateTestimonialDto);
  }

  @Delete(':id')
  @Permission('testimonial.manage')
  remove(@Param('id') id: string) {
    return this.testimonialService.delete({ id: BigInt(id) } as any);
  }

  @Patch(':id/featured')
  @Permission('testimonial.manage')
  toggleFeatured(@Param('id') id: string, @Body('featured') featured: boolean) {
    return this.testimonialService.toggleFeatured(Number(id), featured);
  }
}

