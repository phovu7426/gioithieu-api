import { IsString, IsOptional, IsDateString, IsEnum, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCertificateDto {
    @ApiProperty({ description: 'Certificate name' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Certificate image URL' })
    @IsString()
    image: string;

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

    @ApiProperty({ description: 'Certificate type', enum: ['iso', 'award', 'license', 'certification', 'other'] })
    @IsEnum(['iso', 'award', 'license', 'certification', 'other'])
    type: string;

    @ApiPropertyOptional({ description: 'Status', enum: ['active', 'inactive'], default: 'active' })
    @IsOptional()
    @IsEnum(['active', 'inactive'])
    status?: string;

    @ApiPropertyOptional({ description: 'Sort order', default: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    sortOrder?: number;
}
