import { Entity } from '@/common/base/domain/entity.base';

export interface IPostCommentProps {
    postId: bigint;
    userId?: bigint;
    guestName?: string;
    guestEmail?: string;
    parentId?: bigint;
    content: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export class PostComment extends Entity<bigint> {
    private props: IPostCommentProps;
    private constructor(id: bigint, props: IPostCommentProps) { super(id); this.props = props; }
    static create(id: bigint, props: IPostCommentProps) { return new PostComment(id, props); }
    toObject() {
        return {
            id: this.id,
            ...this.props,
            postId: this.props.postId.toString(),
            userId: this.props.userId?.toString(),
            parentId: this.props.parentId?.toString()
        };
    }
}

export interface IPostViewStatsProps {
    postId: bigint;
    viewDate: Date;
    viewCount: number;
    updatedAt: Date;
}

export class PostViewStats extends Entity<bigint> {
    private props: IPostViewStatsProps;
    private constructor(id: bigint, props: IPostViewStatsProps) { super(id); this.props = props; }
    static create(id: bigint, props: IPostViewStatsProps) { return new PostViewStats(id, props); }
    toObject() {
        return {
            id: this.id,
            ...this.props,
            postId: this.props.postId.toString()
        };
    }
}
