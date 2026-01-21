import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { User } from '@/domain/models/user.model';

@Injectable()
export class ListUsersUseCase {
    constructor(@Inject('IUserRepository') private readonly userRepo: IUserRepository) { }
    async execute() {
        return (await this.userRepo.findAll()).map(u => u.toObject());
    }
}

@Injectable()
export class GetUserUseCase {
    constructor(@Inject('IUserRepository') private readonly userRepo: IUserRepository) { }
    async execute(id: bigint) {
        const user = await this.userRepo.findById(id);
        if (!user) throw new NotFoundException('User not found');
        return user.toObject();
    }
}
