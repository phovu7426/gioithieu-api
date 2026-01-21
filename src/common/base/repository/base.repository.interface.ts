/**
 * Base Repository Interface for Domain-Driven Design
 * All repository interfaces should extend this interface
 * This is completely ORM-agnostic
 */
export interface IBaseRepository<T, ID = bigint> {
    /**
     * Find an entity by its ID
     */
    findById(id: ID): Promise<T | null>;

    /**
     * Find all entities
     */
    findAll(): Promise<T[]>;

    /**
     * Save a new entity
     */
    save(entity: T): Promise<T>;

    /**
     * Update an existing entity
     */
    update(entity: T): Promise<T>;

    /**
     * Delete an entity by its ID (soft delete)
     */
    delete(id: ID): Promise<boolean>;

    /**
     * Check if an entity exists by its ID
     */
    exists(id: ID): Promise<boolean>;
}
