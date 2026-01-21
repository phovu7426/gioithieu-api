import { AggregateRoot } from '@/common/base/domain/aggregate-root.base';
import { PostStatus } from '@/domain/value-objects/post-status.vo';
import { ValidationException } from '@/domain/exceptions';

export interface IPostProps {
    name: string;
    slug: string;
    excerpt?: string;
    content: string;
    image?: string;
    coverImage?: string;
    primaryCategoryId?: bigint;
    status: PostStatus;
    postType: string;
    videoUrl?: string;
    audioUrl?: string;
    isFeatured: boolean;
    isPinned: boolean;
    publishedAt?: Date;
    viewCount: bigint;
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    groupId?: bigint;
    createdUserId?: bigint;
    updatedUserId?: bigint;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;

    // Relations (as IDs for now, can be expanded to full entities later)
    categoryIds?: bigint[];
    tagIds?: bigint[];
}

/**
 * Post Domain Model
 * Encapsulates all business logic for a blog post
 */
export class Post extends AggregateRoot<bigint> {
    private props: IPostProps;

    private constructor(id: bigint, props: IPostProps) {
        super(id);
        this.props = props;
    }

    static create(id: bigint, props: IPostProps): Post {
        if (!props.name || props.name.trim().length === 0) {
            throw new ValidationException('Post name is required');
        }
        if (!props.slug || props.slug.trim().length === 0) {
            throw new ValidationException('Post slug is required');
        }
        if (!props.content || props.content.trim().length === 0) {
            throw new ValidationException('Post content is required');
        }

        return new Post(id, props);
    }

    // Getters
    get name(): string { return this.props.name; }
    get slug(): string { return this.props.slug; }
    get excerpt(): string | undefined { return this.props.excerpt; }
    get content(): string { return this.props.content; }
    get image(): string | undefined { return this.props.image; }
    get coverImage(): string | undefined { return this.props.coverImage; }
    get primaryCategoryId(): bigint | undefined { return this.props.primaryCategoryId; }
    get status(): PostStatus { return this.props.status; }
    get postType(): string { return this.props.postType; }
    get isFeatured(): boolean { return this.props.isFeatured; }
    get isPinned(): boolean { return this.props.isPinned; }
    get viewCount(): bigint { return this.props.viewCount; }
    get createdAt(): Date { return this.props.createdAt; }
    get updatedAt(): Date { return this.props.updatedAt; }
    get deletedAt(): Date | undefined { return this.props.deletedAt; }
    get categoryIds(): bigint[] { return this.props.categoryIds || []; }
    get tagIds(): bigint[] { return this.props.tagIds || []; }

    // Business Methods

    /**
     * Publish the post
     */
    publish(): void {
        this.props.status = PostStatus.published();
        this.props.publishedAt = this.props.publishedAt || new Date();
        this.props.updatedAt = new Date();
    }

    /**
     * Archive the post
     */
    archive(): void {
        this.props.status = PostStatus.archived();
        this.props.updatedAt = new Date();
    }

    /**
     * Increment view count
     */
    incrementViewCount(): void {
        this.props.viewCount += 1n;
        this.props.updatedAt = new Date();
    }

    /**
     * Soft delete the post
     */
    softDelete(): void {
        this.props.deletedAt = new Date();
        this.props.updatedAt = new Date();
    }

    /**
     * Update post details
     */
    updateDetails(data: Partial<Omit<IPostProps, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'viewCount'>>): void {
        if (data.name !== undefined) {
            if (!data.name || data.name.trim().length === 0) throw new ValidationException('Post name is required');
            this.props.name = data.name;
        }
        if (data.slug !== undefined) {
            if (!data.slug || data.slug.trim().length === 0) throw new ValidationException('Post slug is required');
            this.props.slug = data.slug;
        }

        // Update other props...
        Object.assign(this.props, data);

        this.props.updatedAt = new Date();
    }

    /**
     * Update categories
     */
    updateCategories(categoryIds: bigint[]): void {
        this.props.categoryIds = categoryIds;
        this.props.updatedAt = new Date();
    }

    /**
     * Update tags
     */
    updateTags(tagIds: bigint[]): void {
        this.props.tagIds = tagIds;
        this.props.updatedAt = new Date();
    }

    toObject(): any {
        return {
            id: this.id,
            ...this.props,
            status: this.props.status.value,
            viewCount: this.props.viewCount.toString(),
            categoryIds: this.props.categoryIds?.map(id => id.toString()),
            tagIds: this.props.tagIds?.map(id => id.toString()),
        };
    }
}
