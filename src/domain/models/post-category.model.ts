import { AggregateRoot } from '@/common/base/domain/aggregate-root.base';
import { Status } from '@/domain/value-objects';
import { ValidationException } from '@/domain/exceptions';

export interface IPostCategoryProps {
    name: string;
    slug: string;
    description?: string;
    parentId?: bigint;
    image?: string;
    status: Status;
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    ogImage?: string;
    sortOrder: number;
    createdUserId?: bigint;
    updatedUserId?: bigint;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

/**
 * Post Category Domain Model
 */
export class PostCategory extends AggregateRoot<bigint> {
    private props: IPostCategoryProps;

    private constructor(id: bigint, props: IPostCategoryProps) {
        super(id);
        this.props = props;
    }

    static create(id: bigint, props: IPostCategoryProps): PostCategory {
        if (!props.name || props.name.trim().length === 0) {
            throw new ValidationException('Category name is required');
        }
        if (!props.slug || props.slug.trim().length === 0) {
            throw new ValidationException('Category slug is required');
        }

        return new PostCategory(id, props);
    }

    // Getters
    get name(): string { return this.props.name; }
    get slug(): string { return this.props.slug; }
    get parentId(): bigint | undefined { return this.props.parentId; }
    get status(): Status { return this.props.status; }
    get sortOrder(): number { return this.props.sortOrder; }

    // Methods
    activate(): void {
        this.props.status = Status.active();
        this.props.updatedAt = new Date();
    }

    deactivate(): void {
        this.props.status = Status.inactive();
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
            status: this.props.status.value,
        };
    }
}
