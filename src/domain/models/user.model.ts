import { AggregateRoot } from '@/common/base/domain/aggregate-root.base';
import { Email, Status } from '@/domain/value-objects';

export interface IUserProps {
    username?: string;
    email?: Email;
    phone?: string;
    password?: string;
    name?: string;
    image?: string;
    googleId?: string;
    status: Status;
    emailVerifiedAt?: Date;
    phoneVerifiedAt?: Date;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export class User extends AggregateRoot<bigint> {
    private props: IUserProps;

    private constructor(id: bigint, props: IUserProps) {
        super(id);
        this.props = props;
    }

    static create(id: bigint, props: IUserProps): User {
        return new User(id, props);
    }

    // Getters
    get email(): Email | undefined { return this.props.email; }
    get username(): string | undefined { return this.props.username; }
    get name(): string | undefined { return this.props.name; }
    get image(): string | undefined { return this.props.image; }
    get status(): Status { return this.props.status; }

    updateProfile(data: Partial<Pick<IUserProps, 'name' | 'image' | 'phone'>>): void {
        Object.assign(this.props, data);
        this.props.updatedAt = new Date();
    }

    softDelete(): void {
        this.props.deletedAt = new Date();
        this.props.updatedAt = new Date();
    }

    toObject(): any {
        return {
            id: this.id,
            ...this.props,
            email: this.props.email?.value,
            status: this.props.status.value,
        };
    }
}
