import { AggregateRoot } from '@/common/base/domain/aggregate-root.base';
import { Status } from '@/domain/value-objects/status.vo';
import { ValidationException } from '@/domain/exceptions';

export interface IBannerLocationProps {
    code: string;
    name: string;
    description?: string;
    status: Status;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export class BannerLocation extends AggregateRoot<bigint> {
    private props: IBannerLocationProps;
    private constructor(id: bigint, props: IBannerLocationProps) { super(id); this.props = props; }
    static create(id: bigint, props: IBannerLocationProps) {
        if (!props.code) throw new ValidationException('Banner location code is required');
        if (!props.name) throw new ValidationException('Banner location name is required');
        return new BannerLocation(id, props);
    }
    toObject() { return { id: this.id, ...this.props, status: this.props.status.value }; }
}

export interface IBannerProps {
    title: string;
    subtitle?: string;
    image: string;
    mobileImage?: string;
    link?: string;
    linkTarget: string;
    description?: string;
    buttonText?: string;
    buttonColor?: string;
    textColor?: string;
    locationId: bigint;
    sortOrder: number;
    status: Status;
    startDate?: Date;
    endDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export class Banner extends AggregateRoot<bigint> {
    private props: IBannerProps;
    private constructor(id: bigint, props: IBannerProps) { super(id); this.props = props; }
    static create(id: bigint, props: IBannerProps) {
        if (!props.title) throw new ValidationException('Banner title is required');
        if (!props.image) throw new ValidationException('Banner image is required');
        return new Banner(id, props);
    }
    toObject() {
        return {
            id: this.id,
            ...this.props,
            status: this.props.status.value,
            locationId: this.props.locationId.toString()
        };
    }
}
