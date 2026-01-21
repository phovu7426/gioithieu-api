import { Injectable, Inject } from '@nestjs/common';
import { IStaffRepository } from '@/domain/repositories/staff.repository.interface';
import { PublicStaffResponseDto } from './public-staff.response.dto';

@Injectable()
export class ListActiveStaffUseCase {
    constructor(
        @Inject('IStaffRepository')
        private readonly staffRepo: IStaffRepository,
    ) { }

    async execute(): Promise<PublicStaffResponseDto[]> {
        const list = await this.staffRepo.findActive();
        return list.map(item => PublicStaffResponseDto.fromDomain(item));
    }
}
