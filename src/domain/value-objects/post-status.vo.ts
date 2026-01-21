import { ValueObject } from '@/common/base/domain/value-object.base';
import { ValidationException } from '@/domain/exceptions';

interface PostStatusProps {
    value: string;
}

/**
 * PostStatus Value Object
 * Represents the status of a post (draft, scheduled, published, archived)
 */
export class PostStatus extends ValueObject<PostStatusProps> {
    private static readonly VALID_STATUSES = ['draft', 'scheduled', 'published', 'archived'];

    private constructor(props: PostStatusProps) {
        super(props);
    }

    /**
     * Create a PostStatus value object from string
     */
    static fromString(status: string): PostStatus {
        const normalizedStatus = status?.toLowerCase().trim();

        if (!this.VALID_STATUSES.includes(normalizedStatus)) {
            throw new ValidationException(
                `Invalid post status: ${status}. Must be one of: ${this.VALID_STATUSES.join(', ')}`,
            );
        }

        return new PostStatus({ value: normalizedStatus });
    }

    static draft(): PostStatus {
        return new PostStatus({ value: 'draft' });
    }

    static published(): PostStatus {
        return new PostStatus({ value: 'published' });
    }

    static archived(): PostStatus {
        return new PostStatus({ value: 'archived' });
    }

    isPublished(): boolean {
        return this.props.value === 'published';
    }

    isDraft(): boolean {
        return this.props.value === 'draft';
    }

    get value(): string {
        return this.props.value;
    }

    toString(): string {
        return this.value;
    }
}
