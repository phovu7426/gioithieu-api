import { AggregateRoot } from '@/common/base/domain/aggregate-root.base';
import { Status } from '@/domain/value-objects/status.vo';
import { ValidationException } from '@/domain/exceptions';

export interface ITestimonialProps {
    clientName: string;
    clientPosition?: string;
    clientCompany?: string;
    clientAvatar?: string;
    content: string;
    rating?: number;
    projectId?: bigint;
    featured: boolean;
    status: Status;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export class Testimonial extends AggregateRoot<bigint> {
    private props: ITestimonialProps;
    private constructor(id: bigint, props: ITestimonialProps) { super(id); this.props = props; }
    static create(id: bigint, props: ITestimonialProps) {
        if (!props.clientName) throw new ValidationException('Client name is required');
        if (!props.content) throw new ValidationException('Content is required');
        return new Testimonial(id, props);
    }
    softDelete() { this.props.deletedAt = new Date(); this.props.updatedAt = new Date(); }

    updateDetails(data: Partial<Omit<ITestimonialProps, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): void {
        const propsToUpdate = { ...data };
        if (propsToUpdate.projectId !== undefined) {
            propsToUpdate.projectId = propsToUpdate.projectId ? BigInt(propsToUpdate.projectId) : undefined;
        }
        Object.assign(this.props, propsToUpdate);
        this.props.updatedAt = new Date();
    }

    toggleFeatured(featured: boolean): void {
        this.props.featured = featured;
        this.props.updatedAt = new Date();
    }
    toObject() {
        return {
            id: this.id,
            ...this.props,
            status: this.props.status.value,
            projectId: this.props.projectId?.toString()
        };
    }
}
