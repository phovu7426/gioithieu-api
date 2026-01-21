import { Injectable, Inject } from '@nestjs/common';
import { IPostRepository } from '@/domain/repositories/post.repository.interface';

@Injectable()
export class ListPostsUseCase {
    constructor(@Inject('IPostRepository') private readonly postRepo: IPostRepository) { }
    async execute(query: any) {
        const { items, total, page, limit, lastPage } = await this.postRepo.findWithPagination({
            page: Number(query.page) || 1,
            limit: Number(query.limit) || 10,
            status: query.status,
            categoryId: query.categoryId ? BigInt(query.categoryId) : undefined,
            search: query.search,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
        });

        return {
            data: items.map(post => post.toObject()),
            meta: { total, page, limit, lastPage }
        };
    }
}
