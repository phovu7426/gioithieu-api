import { Entity } from '@/common/base/domain/entity.base';

export interface IProfileProps {
    userId: bigint;
    birthday?: Date;
    gender?: string;
    address?: string;
    about?: string;
    createdAt: Date;
    updatedAt: Date;
}

export class Profile extends Entity<bigint> {
    private props: IProfileProps;
    private constructor(id: bigint, props: IProfileProps) { super(id); this.props = props; }
    static create(id: bigint, props: IProfileProps) { return new Profile(id, props); }
    toObject() { return { id: this.id, ...this.props, userId: this.props.userId.toString() }; }
}
