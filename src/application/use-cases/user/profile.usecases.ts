import { Injectable, Inject } from '@nestjs/common';
import { IProfileRepository } from '@/domain/repositories/user-profile.repository.interface';

@Injectable()
export class GetUserProfileUseCase {
    constructor(@Inject('IProfileRepository') private readonly repo: IProfileRepository) { }
    async execute(userId: bigint) {
        const profile = await this.repo.findByUserId(userId);
        return profile ? profile.toObject() : null;
    }
}
