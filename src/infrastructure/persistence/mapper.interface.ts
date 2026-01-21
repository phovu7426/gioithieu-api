/**
 * Mapper Interface for converting between Domain and Persistence layers
 * This ensures complete separation between domain models and ORM entities
 */
export interface IMapper<DomainEntity, PersistenceEntity> {
    /**
     * Convert from persistence entity (e.g., Prisma) to domain entity
     */
    toDomain(raw: PersistenceEntity): DomainEntity;

    /**
     * Convert from domain entity to persistence entity
     */
    toPersistence(domain: DomainEntity): Partial<PersistenceEntity>;
}
