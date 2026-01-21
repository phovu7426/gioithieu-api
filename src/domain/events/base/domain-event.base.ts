import { randomUUID } from 'crypto';

/**
 * Base Domain Event
 * All domain events should extend this class
 */
export abstract class DomainEvent {
    public readonly occurredOn: Date;
    public readonly eventId: string;

    constructor() {
        this.occurredOn = new Date();
        this.eventId = randomUUID();
    }

    /**
     * Get the event name for event bus
     */
    abstract getEventName(): string;
}
