import { Controller, Get, Post, Body, ValidationPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ListAllBannersUseCase } from '@/application/use-cases/marketing/banner.usecases';
import { Permission } from '@/common/decorators/rbac.decorators';

@ApiTags('Admin / Marketing / Banners')
@Controller('admin/banners')
export class AdminBannerController {
    constructor(private readonly listUseCase: ListAllBannersUseCase) { }

    @ApiOperation({ summary: 'List all banners for admin' })
    @Permission('banner.manage')
    @Get()
    async findAll() {
        return this.listUseCase.execute();
    }
}
