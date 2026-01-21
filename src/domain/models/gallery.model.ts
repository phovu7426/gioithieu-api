import { AggregateRoot } from '@/common/base/domain/aggregate-root.base';
import { Status } from '@/domain/value-objects/status.vo';
import { ValidationException } from '@/domain/exceptions';

export interface IGalleryProps {
    title: string;
    slug: string;
    description?: string;
    coverImage?: string;
    images: any;
    featured: boolean;
    status: Status;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export class Gallery extends AggregateRoot<bigint> {
    private props: IGalleryProps;
    private constructor(id: bigint, props: IGalleryProps) { super(id); this.props = props; }
    static create(id: bigint, props: IGalleryProps) {
        if (!props.title) throw new ValidationException('Gallery title is required');
        if (!props.slug) throw new ValidationException('Gallery slug is required');
        return new Gallery(id, props);
    }
    get title() { return this.props.title; }
    get slug() { return this.props.slug; }
    softDelete() { this.props.deletedAt = new Date(); this.props.updatedAt = new Date(); }
    updateDetails(data: Partial<Omit<IGalleryProps, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): void {
        Object.assign(this.props, data);
        this.props.updatedAt = new Date();
    }
    toObject() { return { id: this.id, ...this.props, status: this.props.status.value }; }
}
