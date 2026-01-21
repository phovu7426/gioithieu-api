import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IStaffRepository } from '@/domain/repositories/staff.repository.interface';
import { Status } from '@/domain/value-objects/status.vo';
import { UpdateStaffDto } from './update-staff.dto';
import { AdminStaffResponseDto } from '../../queries/admin/admin-staff.response.dto';

@Injectable()
export class UpdateStaffUseCase {
    constructor(
        @Inject('IStaffRepository')
        private readonly staffRepo: IStaffRepository,
    ) { }

    async execute(id: bigint, dto: UpdateStaffDto): Promise<AdminStaffResponseDto> {
        const staff = await this.staffRepo.findById(id);
        if (!staff) {
            throw new NotFoundException(`Staff with ID ${id} not found`);
        }

        const updateData: any = { ...dto };
        if (dto.status) {
            updateData.status = Status.fromString(dto.status);
        }

        staff.updateDetails(updateData);
        const updated = await this.staffRepo.update(staff);
        return AdminStaffResponseDto.fromDomain(updated);
    }
}
