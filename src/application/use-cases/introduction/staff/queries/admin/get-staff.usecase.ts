import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IStaffRepository } from '@/domain/repositories/staff.repository.interface';
import { AdminStaffResponseDto } from './admin-staff.response.dto';

@Injectable()
export class GetStaffUseCase {
    constructor(
        @Inject('IStaffRepository')
        private readonly staffRepo: IStaffRepository,
    ) { }

    async execute(id: bigint): Promise<AdminStaffResponseDto> {
        const staff = await this.staffRepo.findById(id);
        if (!staff) {
            throw new NotFoundException(`Staff with ID ${id} not found`);
        }
        return AdminStaffResponseDto.fromDomain(staff);
    }
}
