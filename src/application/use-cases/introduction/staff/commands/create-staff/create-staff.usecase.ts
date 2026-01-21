import { Injectable, Inject } from '@nestjs/common';
import { IStaffRepository } from '@/domain/repositories/staff.repository.interface';
import { Staff } from '@/domain/models/staff.model';
import { Status } from '@/domain/value-objects/status.vo';
import { CreateStaffDto } from './create-staff.dto';
import { AdminStaffResponseDto } from '../../queries/admin/admin-staff.response.dto';

@Injectable()
export class CreateStaffUseCase {
    constructor(
        @Inject('IStaffRepository')
        private readonly staffRepo: IStaffRepository,
    ) { }

    async execute(dto: CreateStaffDto): Promise<AdminStaffResponseDto> {
        const staff = Staff.create(0n, {
            ...dto,
            status: Status.fromString(dto.status || 'active'),
            sortOrder: dto.sortOrder || 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const saved = await this.staffRepo.save(staff);
        return AdminStaffResponseDto.fromDomain(saved);
    }
}
