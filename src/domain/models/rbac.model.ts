import { AggregateRoot } from '@/common/base/domain/aggregate-root.base';

export interface IRoleProps {
    code: string;
    name?: string;
    status: string;
    parentId?: bigint;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export class Role extends AggregateRoot<bigint> {
    private props: IRoleProps;
    private constructor(id: bigint, props: IRoleProps) { super(id); this.props = props; }
    static create(id: bigint, props: IRoleProps) { return new Role(id, props); }
    toObject() { return { id: this.id, ...this.props, parentId: this.props.parentId?.toString() }; }
}

export interface IPermissionProps {
    code: string;
    scope: string;
    name?: string;
    status: string;
    parentId?: bigint;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export class Permission extends AggregateRoot<bigint> {
    private props: IPermissionProps;
    private constructor(id: bigint, props: IPermissionProps) { super(id); this.props = props; }
    static create(id: bigint, props: IPermissionProps) { return new Permission(id, props); }
    toObject() { return { id: this.id, ...this.props, parentId: this.props.parentId?.toString() }; }
}

export interface IContextProps {
    code: string;
    name: string;
    type: string;
    refId?: bigint;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export class Context extends AggregateRoot<bigint> {
    private props: IContextProps;
    private constructor(id: bigint, props: IContextProps) { super(id); this.props = props; }
    static create(id: bigint, props: IContextProps) { return new Context(id, props); }
    toObject() { return { id: this.id, ...this.props, refId: this.props.refId?.toString() }; }
}
