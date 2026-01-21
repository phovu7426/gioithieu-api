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
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateTestimonialUseCase } from '@/application/use-cases/introduction/testimonial/commands/create-testimonial/create-testimonial.usecase';
import { UpdateTestimonialUseCase } from '@/application/use-cases/introduction/testimonial/commands/update-testimonial/update-testimonial.usecase';
import { DeleteTestimonialUseCase } from '@/application/use-cases/introduction/testimonial/commands/delete-testimonial/delete-testimonial.usecase';
import { ToggleTestimonialFeaturedUseCase } from '@/application/use-cases/introduction/testimonial/commands/toggle-featured/toggle-featured.usecase';
import { ListTestimonialsUseCase } from '@/application/use-cases/introduction/testimonial/queries/admin/list-testimonials.usecase';
import { GetTestimonialUseCase } from '@/application/use-cases/introduction/testimonial/queries/admin/get-testimonial.usecase';
import { CreateTestimonialDto } from '@/application/use-cases/introduction/testimonial/commands/create-testimonial/create-testimonial.dto';
import { UpdateTestimonialDto } from '@/application/use-cases/introduction/testimonial/commands/update-testimonial/update-testimonial.dto';
import { LogRequest } from '@/common/decorators/log-request.decorator';
import { Permission } from '@/common/decorators/rbac.decorators';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RbacGuard } from '@/common/guards/rbac.guard';

@ApiTags('Admin / Introduction / Testimonial')
@Controller('admin/testimonials')
@UseGuards(JwtAuthGuard, RbacGuard)
export class TestimonialController {
  constructor(
    private readonly listUseCase: ListTestimonialsUseCase,
    private readonly getUseCase: GetTestimonialUseCase,
    private readonly createUseCase: CreateTestimonialUseCase,
    private readonly updateUseCase: UpdateTestimonialUseCase,
    private readonly deleteUseCase: DeleteTestimonialUseCase,
    private readonly toggleFeaturedUseCase: ToggleTestimonialFeaturedUseCase,
  ) { }

  @LogRequest()
  @Post()
  @Permission('testimonial.manage')
  @ApiOperation({ summary: 'Create new testimonial' })
  create(@Body(ValidationPipe) dto: CreateTestimonialDto) {
    return this.createUseCase.execute(dto);
  }

  @Get()
  @Permission('testimonial.manage')
  @ApiOperation({ summary: 'List all testimonials' })
  findAll() {
    return this.listUseCase.execute();
  }

  @Get(':id')
  @Permission('testimonial.manage')
  @ApiOperation({ summary: 'Get testimonial by ID' })
  findOne(@Param('id') id: string) {
    return this.getUseCase.execute(BigInt(id));
  }

  @Put(':id')
  @Permission('testimonial.manage')
  @ApiOperation({ summary: 'Update testimonial' })
  update(@Param('id') id: string, @Body(ValidationPipe) dto: UpdateTestimonialDto) {
    return this.updateUseCase.execute(BigInt(id), dto);
  }

  @Delete(':id')
  @Permission('testimonial.manage')
  @ApiOperation({ summary: 'Delete testimonial' })
  remove(@Param('id') id: string) {
    return this.deleteUseCase.execute(BigInt(id));
  }

  @Patch(':id/featured')
  @Permission('testimonial.manage')
  @ApiOperation({ summary: 'Toggle featured status' })
  toggleFeatured(@Param('id') id: string, @Body('featured') featured: boolean) {
    return this.toggleFeaturedUseCase.execute(BigInt(id), featured);
  }
}

