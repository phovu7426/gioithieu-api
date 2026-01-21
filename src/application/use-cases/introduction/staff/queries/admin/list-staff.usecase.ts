import { Injectable, Inject } from '@nestjs/common';
import { IStaffRepository } from '@/domain/repositories/staff.repository.interface';
import { AdminStaffResponseDto } from './admin-staff.response.dto';

@Injectable()
export class ListStaffUseCase {
    constructor(
        @Inject('IStaffRepository')
        private readonly staffRepo: IStaffRepository,
    ) { }

    async execute(): Promise<AdminStaffResponseDto[]> {
        const list = await this.staffRepo.findAll();
        return list.map(item => AdminStaffResponseDto.fromDomain(item));
    }
}
