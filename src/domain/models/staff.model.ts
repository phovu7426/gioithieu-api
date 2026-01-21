import { AggregateRoot } from '@/common/base/domain/aggregate-root.base';
import { Status } from '@/domain/value-objects/status.vo';
import { ValidationException } from '@/domain/exceptions';

export interface IStaffProps {
    name: string;
    position: string;
    department?: string;
    bio?: string;
    avatar?: string;
    email?: string;
    phone?: string;
    socialLinks?: any;
    experience?: number;
    expertise?: string;
    status: Status;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export class Staff extends AggregateRoot<bigint> {
    private props: IStaffProps;

    private constructor(id: bigint, props: IStaffProps) {
        super(id);
        this.props = props;
    }

    static create(id: bigint, props: IStaffProps): Staff {
        if (!props.name) throw new ValidationException('Staff name is required');
        if (!props.position) throw new ValidationException('Staff position is required');
        return new Staff(id, props);
    }

    // Getters
    get name(): string { return this.props.name; }
    get position(): string { return this.props.position; }
    get status(): Status { return this.props.status; }
    get sortOrder(): number { return this.props.sortOrder; }

    // Business logic
    softDelete(): void {
        this.props.deletedAt = new Date();
        this.props.updatedAt = new Date();
    }

    updateDetails(data: Partial<Omit<IStaffProps, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): void {
        Object.assign(this.props, data);
        this.props.updatedAt = new Date();
    }

    toObject(): any {
        return {
            id: this.id,
            ...this.props,
            status: this.props.status.value,
        };
    }
}
