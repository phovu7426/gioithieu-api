import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IStaffRepository } from '@/domain/repositories/staff.repository.interface';

@Injectable()
export class DeleteStaffUseCase {
    constructor(
        @Inject('IStaffRepository')
        private readonly staffRepo: IStaffRepository,
    ) { }

    async execute(id: bigint): Promise<void> {
        const staff = await this.staffRepo.findById(id);
        if (!staff) {
            throw new NotFoundException(`Staff with ID ${id} not found`);
        }

        staff.softDelete();
        await this.staffRepo.update(staff);
    }
}
