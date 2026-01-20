import { Injectable, Inject } from '@nestjs/common';
import { IPostCommentRepository, POST_COMMENT_REPOSITORY, PostCommentFilter } from '@/modules/post/repositories/post-comment.repository.interface';

@Injectable()
export class AdminPostCommentService {
    constructor(
        @Inject(POST_COMMENT_REPOSITORY)
        private readonly commentRepo: IPostCommentRepository,
    ) { }

    async getList(query: any) {
        const filter: PostCommentFilter = {};
        if (query.post_id) filter.postId = query.post_id;
        if (query.status) filter.status = query.status;
        if (query.search) filter.search = query.search;

        return this.commentRepo.findAll({
            page: query.page,
            limit: query.limit,
            sort: query.sort,
            filter,
        });
    }

    async getOne(id: number) {
        return this.commentRepo.findById(id);
    }

    async updateCommentStatus(id: number, status: string) {
        return this.commentRepo.updateStatus(id, status);
    }

    async deleteComment(id: number) {
        return this.commentRepo.delete(id);
    }
}
