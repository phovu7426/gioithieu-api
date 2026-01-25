import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseIntPipe,
} from '@nestjs/common';
import { ContentTemplateService } from '../services/content-template.service';
import { ContentTemplateExecutionService } from '../../services/content-template-execution.service';
import { CreateContentTemplateDto } from '../dtos/create-content-template.dto';
import { UpdateContentTemplateDto } from '../dtos/update-content-template.dto';
import { ContentTemplateQueryDto } from '../dtos/content-template-query.dto';

@Controller('admin/content-templates')
export class ContentTemplateController {
    constructor(
        private readonly service: ContentTemplateService,
        private readonly executionService: ContentTemplateExecutionService,
    ) { }

    @Post()
    create(@Body() dto: CreateContentTemplateDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll(@Query() query: ContentTemplateQueryDto) {
        return this.service.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateContentTemplateDto,
    ) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }

    @Post(':code/test')
    testExecute(
        @Param('code') code: string,
        @Body() body: { to: string; variables: Record<string, any> },
    ) {
        return this.executionService.execute(code, {
            to: body.to,
            variables: body.variables,
        });
    }
}
