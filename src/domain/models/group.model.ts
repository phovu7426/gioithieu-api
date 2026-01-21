import { AggregateRoot } from '@/common/base/domain/aggregate-root.base';

export interface IGroupProps {
    name?: string;
    code: string;
    type: string;
    status: string;
    contextId: bigint;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export class Group extends AggregateRoot<bigint> {
    private props: IGroupProps;
    private constructor(id: bigint, props: IGroupProps) { super(id); this.props = props; }
    static create(id: bigint, props: IGroupProps) { return new Group(id, props); }
    toObject() { return { id: this.id, ...this.props, contextId: this.props.contextId.toString() }; }
}
