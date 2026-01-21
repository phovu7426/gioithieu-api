import { AggregateRoot } from '@/common/base/domain/aggregate-root.base';
import { Status } from '@/domain/value-objects/status.vo';
import { ValidationException } from '@/domain/exceptions';

export interface IFaqProps {
    question: string;
    answer: string;
    viewCount: bigint;
    helpfulCount: bigint;
    status: Status;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export class Faq extends AggregateRoot<bigint> {
    private props: IFaqProps;
    private constructor(id: bigint, props: IFaqProps) { super(id); this.props = props; }
    static create(id: bigint, props: IFaqProps) {
        if (!props.question) throw new ValidationException('FAQ question is required');
        if (!props.answer) throw new ValidationException('FAQ answer is required');
        return new Faq(id, props);
    }
    softDelete() { this.props.deletedAt = new Date(); this.props.updatedAt = new Date(); }
    updateDetails(data: Partial<Omit<IFaqProps, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): void {
        Object.assign(this.props, data);
        this.props.updatedAt = new Date();
    }
    incrementView(): void {
        this.props.viewCount += 1n;
        this.props.updatedAt = new Date();
    }
    incrementHelpful(): void {
        this.props.helpfulCount += 1n;
        this.props.updatedAt = new Date();
    }
    toObject() {
        return {
            id: this.id,
            ...this.props,
            status: this.props.status.value,
            viewCount: this.props.viewCount.toString(),
            helpfulCount: this.props.helpfulCount.toString()
        };
    }
}
