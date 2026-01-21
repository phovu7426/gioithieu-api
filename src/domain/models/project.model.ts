import { AggregateRoot } from '@/common/base/domain/aggregate-root.base';
import { Status } from '@/domain/value-objects/status.vo';
import { ValidationException } from '@/domain/exceptions';

export interface IProjectProps {
    name: string;
    slug: string;
    description?: string;
    shortDescription?: string;
    coverImage?: string;
    location?: string;
    area?: number;
    startDate?: Date;
    endDate?: Date;
    status: string; // Using string as it has specific enum in Prisma (planning, in_progress, etc.)
    clientName?: string;
    budget?: number;
    images?: any;
    featured: boolean;
    viewCount: bigint;
    sortOrder: number;
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    ogImage?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export class Project extends AggregateRoot<bigint> {
    private props: IProjectProps;

    private constructor(id: bigint, props: IProjectProps) {
        super(id);
        this.props = props;
    }

    static create(id: bigint, props: IProjectProps): Project {
        if (!props.name) throw new ValidationException('Project name is required');
        if (!props.slug) throw new ValidationException('Project slug is required');
        return new Project(id, props);
    }

    get name(): string { return this.props.name; }
    get slug(): string { return this.props.slug; }
    get featured(): boolean { return this.props.featured; }

    softDelete(): void {
        this.props.deletedAt = new Date();
        this.props.updatedAt = new Date();
    }

    updateDetails(data: Partial<Omit<IProjectProps, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): void {
        Object.assign(this.props, data);
        this.props.updatedAt = new Date();
    }

    incrementView(): void {
        this.props.viewCount += 1n;
        this.props.updatedAt = new Date();
    }

    toObject(): any {
        return {
            id: this.id,
            ...this.props,
            viewCount: this.props.viewCount.toString(),
        };
    }
}
