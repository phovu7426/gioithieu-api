import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListCertificatesQuery {
    @ApiPropertyOptional({ description: 'Page number', default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ description: 'Items per page', default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @ApiPropertyOptional({ description: 'Filter by status', enum: ['active', 'inactive'] })
    @IsOptional()
    @IsEnum(['active', 'inactive'])
    status?: string;

    @ApiPropertyOptional({ description: 'Filter by type', enum: ['iso', 'award', 'license', 'certification', 'other'] })
    @IsOptional()
    @IsEnum(['iso', 'award', 'license', 'certification', 'other'])
    type?: string;

    @ApiPropertyOptional({ description: 'Search by name, description, issued by, or certificate number' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ description: 'Sort by field', default: 'sort_order' })
    @IsOptional()
    @IsString()
    sortBy?: string = 'sort_order';

    @ApiPropertyOptional({ description: 'Sort order', enum: ['asc', 'desc'], default: 'asc' })
    @IsOptional()
    @IsEnum(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc' = 'asc';
}
