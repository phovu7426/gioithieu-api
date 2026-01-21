import { DomainException } from './domain.exception';

/**
 * Exception thrown when domain validation fails
 */
export class ValidationException extends DomainException {
    constructor(message: string) {
        super(`Validation failed: ${message}`);
    }
}
