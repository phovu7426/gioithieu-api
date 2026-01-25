import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import {
    CONTENT_TEMPLATE_REPOSITORY,
    IContentTemplateRepository
} from '../../repositories/content-template.repository.interface';
import { CreateContentTemplateDto } from '../dtos/create-content-template.dto';
import { UpdateContentTemplateDto } from '../dtos/update-content-template.dto';
import { ContentTemplateQueryDto } from '../dtos/content-template-query.dto';
import { IPaginatedResult } from '@/common/core/repositories';
import { ContentTemplate } from '@prisma/client';

@Injectable()
export class ContentTemplateService {
    constructor(
        @Inject(CONTENT_TEMPLATE_REPOSITORY)
        private readonly repository: IContentTemplateRepository,
    ) { }

    async findAll(query: ContentTemplateQueryDto): Promise<IPaginatedResult<ContentTemplate>> {
        const { page, limit, sort, ...filter } = query;
        return this.repository.findAll({
            page,
            limit,
            sort,
            filter,
        });
    }

    async findOne(id: number): Promise<ContentTemplate> {
        const item = await this.repository.findById(id);
        if (!item || item.deleted_at) {
            throw new NotFoundException(`Content template with ID ${id} not found`);
        }
        return item;
    }

    async findByCode(code: string): Promise<ContentTemplate> {
        const item = await this.repository.findByCode(code);
        if (!item) {
            throw new NotFoundException(`Content template with code ${code} not found`);
        }
        return item;
    }

    async create(dto: CreateContentTemplateDto): Promise<ContentTemplate> {
        const existing = await this.repository.findByCode(dto.code);
        if (existing) {
            throw new ConflictException(`Content template with code ${dto.code} already exists`);
        }
        return this.repository.create(dto);
    }

    async update(id: number, dto: UpdateContentTemplateDto): Promise<ContentTemplate> {
        await this.findOne(id);

        // Type assertion because of PartialType potential issue in some environments
        const updateDto = dto as any;

        if (updateDto.code) {
            const existing = await this.repository.findByCode(updateDto.code);
            if (existing && Number(existing.id) !== id) {
                throw new ConflictException(`Content template with code ${updateDto.code} already exists`);
            }
        }

        return this.repository.update(id, dto);
    }

    async remove(id: number): Promise<void> {
        await this.findOne(id);
        await this.repository.delete(id);
    }
}
