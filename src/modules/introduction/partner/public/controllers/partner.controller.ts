import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ListActivePartnersUseCase } from '@/application/use-cases/introduction/partner/queries/public/list-active-partners.usecase';
import { ListPartnersByTypeUseCase } from '@/application/use-cases/introduction/partner/queries/public/list-partners-by-type.usecase';
import { Permission } from '@/common/decorators/rbac.decorators';

@ApiTags('Public / Partner')
@Controller('partners')
export class PublicPartnerController {
  constructor(
    private readonly listActiveUseCase: ListActivePartnersUseCase,
    private readonly listByTypeUseCase: ListPartnersByTypeUseCase,
  ) { }

  @ApiOperation({ summary: 'List all active partners' })
  @Permission('public')
  @Get()
  findAll() {
    return this.listActiveUseCase.execute();
  }

  @ApiOperation({ summary: 'List partners by type' })
  @Permission('public')
  @Get('type/:type')
  findByType(@Param('type') type: string) {
    return this.listByTypeUseCase.execute(type);
  }
}
