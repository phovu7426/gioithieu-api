import { ValueObject } from '@/common/base/domain/value-object.base';
import { ValidationException } from '@/domain/exceptions';

interface StatusProps {
    value: string;
}

/**
 * Status Value Object
 * Represents entity status (active/inactive)
 */
export class Status extends ValueObject<StatusProps> {
    private static readonly VALID_STATUSES = ['active', 'inactive'];

    private constructor(props: StatusProps) {
        super(props);
    }

    /**
     * Create a Status value object from string
     * @throws ValidationException if status is invalid
     */
    static fromString(status: string): Status {
        const normalizedStatus = status?.toLowerCase().trim();

        if (!this.VALID_STATUSES.includes(normalizedStatus)) {
            throw new ValidationException(
                `Invalid status: ${status}. Must be one of: ${this.VALID_STATUSES.join(', ')}`,
            );
        }

        return new Status({ value: normalizedStatus });
    }

    /**
     * Create an active status
     */
    static active(): Status {
        return new Status({ value: 'active' });
    }

    /**
     * Create an inactive status
     */
    static inactive(): Status {
        return new Status({ value: 'inactive' });
    }

    /**
     * Check if status is active
     */
    isActive(): boolean {
        return this.props.value === 'active';
    }

    /**
     * Check if status is inactive
     */
    isInactive(): boolean {
        return this.props.value === 'inactive';
    }

    get value(): string {
        return this.props.value;
    }

    toString(): string {
        return this.value;
    }
}
