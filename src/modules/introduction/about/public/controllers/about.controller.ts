import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ListActiveAboutSectionsUseCase } from '@/application/use-cases/introduction/about/queries/public/list-active-sections.usecase';
import { GetAboutSectionBySlugUseCase } from '@/application/use-cases/introduction/about/queries/public/get-section-by-slug.usecase';
import { Permission } from '@/common/decorators/rbac.decorators';

@ApiTags('Public / About')
@Controller('about-sections')
export class PublicAboutController {
  constructor(
    private readonly listActiveUseCase: ListActiveAboutSectionsUseCase,
    private readonly getBySlugUseCase: GetAboutSectionBySlugUseCase,
  ) { }

  @ApiOperation({ summary: 'List all active about sections' })
  @Permission('public')
  @Get()
  findAll() {
    return this.listActiveUseCase.execute();
  }

  @ApiOperation({ summary: 'Get about section by slug' })
  @Permission('public')
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.getBySlugUseCase.execute(slug);
  }
}

