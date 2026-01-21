import { Injectable, Inject } from '@nestjs/common';
import { IMenuRepository } from '@/domain/repositories/core-system.repository.interface';

@Injectable()
export class GetMenuTreeUseCase {
    constructor(@Inject('IMenuRepository') private readonly repo: IMenuRepository) { }
    async execute() {
        const menus = await this.repo.findTree();
        return menus.map(m => m.toObject());
    }
}
