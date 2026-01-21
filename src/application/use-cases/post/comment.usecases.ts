import { Injectable, Inject } from '@nestjs/common';
import { IPostCommentRepository } from '@/domain/repositories/post-extended.repository.interface';

@Injectable()
export class ListPostCommentsUseCase {
    constructor(@Inject('IPostCommentRepository') private readonly repo: IPostCommentRepository) { }
    async execute(postId: bigint) {
        const comments = await this.repo.findByPost(postId);
        return comments.map(c => c.toObject());
    }
}
