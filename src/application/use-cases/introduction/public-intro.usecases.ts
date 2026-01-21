import { Injectable, Inject } from '@nestjs/common';
import { IStaffRepository, IProjectRepository } from '@/domain/repositories';

@Injectable()
export class GetPublicStaffUseCase {
    constructor(@Inject('IStaffRepository') private readonly repo: IStaffRepository) { }
    async execute() {
        const list = await this.repo.findAll();
        return list.filter(i => i.status.value === 'active').map(i => i.toObject());
    }
}

@Injectable()
export class GetPublicProjectsUseCase {
    constructor(@Inject('IProjectRepository') private readonly repo: IProjectRepository) { }
    async execute() {
        const list = await this.repo.findAll();
        return list.filter(i => i.toObject().status === 'active').map(i => i.toObject());
    }
}
