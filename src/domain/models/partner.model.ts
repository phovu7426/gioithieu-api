import { AggregateRoot } from '@/common/base/domain/aggregate-root.base';
import { Status } from '@/domain/value-objects/status.vo';
import { ValidationException } from '@/domain/exceptions';

export interface IPartnerProps {
    name: string;
    logo: string;
    website?: string;
    description?: string;
    type: string;
    status: Status;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export class Partner extends AggregateRoot<bigint> {
    private props: IPartnerProps;
    private constructor(id: bigint, props: IPartnerProps) { super(id); this.props = props; }
    static create(id: bigint, props: IPartnerProps) {
        if (!props.name) throw new ValidationException('Partner name is required');
        if (!props.logo) throw new ValidationException('Partner logo is required');
        return new Partner(id, props);
    }
    get name() { return this.props.name; }
    softDelete() { this.props.deletedAt = new Date(); this.props.updatedAt = new Date(); }
    updateDetails(data: Partial<Omit<IPartnerProps, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): void {
        Object.assign(this.props, data);
        this.props.updatedAt = new Date();
    }
    toObject() { return { id: this.id, ...this.props, status: this.props.status.value }; }
}
