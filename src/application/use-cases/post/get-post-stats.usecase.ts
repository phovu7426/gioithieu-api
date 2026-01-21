import { Injectable, Inject } from '@nestjs/common';
import { IPostRepository } from '@/domain/repositories/post.repository.interface';

@Injectable()
export class GetPostStatsUseCase {
    constructor(@Inject('IPostRepository') private readonly postRepo: IPostRepository) { }
    async execute(id: bigint, start: string, end: string) {
        // Logic for statistics would go here, possibly calling a specialized domain service
        // For now, return a placeholder or simple data
        return { id: id.toString(), start, end, views: 0 };
    }
}
