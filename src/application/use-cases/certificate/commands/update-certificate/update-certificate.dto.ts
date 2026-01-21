import { IsString, IsOptional, IsDateString, IsEnum, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCertificateDto {
    @ApiPropertyOptional({ description: 'Certificate name' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: 'Certificate image URL' })
    @IsOptional()
    @IsString()
    image?: string;

    @ApiPropertyOptional({ description: 'Issued by organization' })
    @IsOptional()
    @IsString()
    issuedBy?: string;

    @ApiPropertyOptional({ description: 'Issued date' })
    @IsOptional()
    @IsDateString()
    issuedDate?: string;

    @ApiPropertyOptional({ description: 'Expiry date' })
    @IsOptional()
    @IsDateString()
    expiryDate?: string;

    @ApiPropertyOptional({ description: 'Certificate number' })
    @IsOptional()
    @IsString()
    certificateNumber?: string;

    @ApiPropertyOptional({ description: 'Certificate description' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ description: 'Certificate type', enum: ['iso', 'award', 'license', 'certification', 'other'] })
    @IsOptional()
    @IsEnum(['iso', 'award', 'license', 'certification', 'other'])
    type?: string;

    @ApiPropertyOptional({ description: 'Status', enum: ['active', 'inactive'] })
    @IsOptional()
    @IsEnum(['active', 'inactive'])
    status?: string;

    @ApiPropertyOptional({ description: 'Sort order' })
    @IsOptional()
    @IsInt()
    @Min(0)
    sortOrder?: number;
}
