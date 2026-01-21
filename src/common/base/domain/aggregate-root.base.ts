import { Entity } from './entity.base';

/**
 * Base Aggregate Root class for Domain-Driven Design
 * Aggregate roots are the entry points for domain operations
 * They can emit domain events
 */
export abstract class AggregateRoot<T> extends Entity<T> {
    private _domainEvents: any[] = [];

    /**
     * Add a domain event to be dispatched
     */
    protected addDomainEvent(event: any): void {
        this._domainEvents.push(event);
    }

    /**
     * Get all domain events
     */
    public getDomainEvents(): any[] {
        return this._domainEvents;
    }

    /**
     * Clear all domain events after they have been dispatched
     */
    public clearDomainEvents(): void {
        this._domainEvents = [];
    }

    /**
     * Check if there are any domain events
     */
    public hasDomainEvents(): boolean {
        return this._domainEvents.length > 0;
    }
}
