import { IBaseRepository } from '@/common/base/repository/base.repository.interface';
import { PostComment, PostViewStats } from '@/domain/models/post-extended.model';

export interface IPostCommentRepository extends IBaseRepository<PostComment, bigint> {
    findByPost(postId: bigint): Promise<PostComment[]>;
    findReplies(parentId: bigint): Promise<PostComment[]>;
}

export interface IPostViewStatsRepository extends IBaseRepository<PostViewStats, bigint> {
    findByPostAndDate(postId: bigint, date: Date): Promise<PostViewStats | null>;
    incrementView(postId: bigint, date: Date): Promise<void>;
}
