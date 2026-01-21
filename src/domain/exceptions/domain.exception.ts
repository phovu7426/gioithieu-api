/**
 * Base Domain Exception
 * All domain exceptions should extend this class
 */
export class DomainException extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
