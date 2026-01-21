import { AggregateRoot } from '@/common/base/domain/aggregate-root.base';
import { Entity } from '@/common/base/domain/entity.base';





export interface IPostTagProps {
    name: string;
    slug: string;
    createdAt: Date;
}

export class PostTag extends AggregateRoot<bigint> {
    private props: IPostTagProps;
    private constructor(id: bigint, props: IPostTagProps) { super(id); this.props = props; }
    static create(id: bigint, props: IPostTagProps) { return new PostTag(id, props); }
    toObject() { return { id: this.id, ...this.props }; }
}


