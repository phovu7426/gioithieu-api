/**
 * Base Entity class for Domain-Driven Design
 * All domain entities should extend this class
 */
export abstract class Entity<T> {
    protected readonly _id: T;

    constructor(id: T) {
        this._id = id;
    }

    get id(): T {
        return this._id;
    }

    /**
     * Check if two entities are equal based on their IDs
     */
    equals(entity: Entity<T>): boolean {
        if (!entity) {
            return false;
        }

        if (!(entity instanceof Entity)) {
            return false;
        }

        return this._id === entity._id;
    }

    /**
     * Convert entity to plain object for serialization
     */
    abstract toObject(): any;
}
