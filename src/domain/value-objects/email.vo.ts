import { ValueObject } from '@/common/base/domain/value-object.base';
import { ValidationException } from '@/domain/exceptions';

interface EmailProps {
    value: string;
}

/**
 * Email Value Object
 * Ensures email format is valid
 */
export class Email extends ValueObject<EmailProps> {
    private constructor(props: EmailProps) {
        super(props);
    }

    /**
     * Create an Email value object
     * @throws ValidationException if email format is invalid
     */
    static create(email: string): Email {
        if (!this.isValid(email)) {
            throw new ValidationException('Invalid email format');
        }
        return new Email({ value: email.toLowerCase().trim() });
    }

    /**
     * Validate email format
     */
    private static isValid(email: string): boolean {
        if (!email || typeof email !== 'string') {
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    get value(): string {
        return this.props.value;
    }

    toString(): string {
        return this.value;
    }
}
