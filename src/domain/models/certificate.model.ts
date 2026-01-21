import { AggregateRoot } from '@/common/base/domain/aggregate-root.base';
import { Status } from '@/domain/value-objects';
import { ValidationException } from '@/domain/exceptions';
import { CertificateCreatedEvent } from '@/domain/events/certificate/certificate-created.event';

export interface ICertificateProps {
    name: string;
    image: string;
    issuedBy?: string;
    issuedDate?: Date;
    expiryDate?: Date;
    certificateNumber?: string;
    description?: string;
    type: string;
    status: Status;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

/**
 * Certificate Domain Model
 * Represents a certificate entity with business logic
 */
export class Certificate extends AggregateRoot<bigint> {
    private props: ICertificateProps;

    private constructor(id: bigint, props: ICertificateProps) {
        super(id);
        this.props = props;
    }

    /**
     * Create a new Certificate domain entity
     * @throws ValidationException if validation fails
     */
    static create(id: bigint, props: ICertificateProps): Certificate {
        // Validation logic
        if (!props.name || props.name.trim().length === 0) {
            throw new ValidationException('Certificate name is required');
        }

        if (!props.image || props.image.trim().length === 0) {
            throw new ValidationException('Certificate image is required');
        }

        // Validate expiry date is after issued date
        if (props.issuedDate && props.expiryDate && props.expiryDate < props.issuedDate) {
            throw new ValidationException('Expiry date must be after issued date');
        }

        const certificate = new Certificate(id, props);

        // Dispatch event if it's a new certificate (id 0n or generated)
        // Note: Usually we add events only for new creations or specific state changes
        if (id === 0n) {
            certificate.addDomainEvent(
                new CertificateCreatedEvent(id, props.name, props.type)
            );
        }

        return certificate;
    }

    // Getters
    get name(): string {
        return this.props.name;
    }

    get image(): string {
        return this.props.image;
    }

    get issuedBy(): string | undefined {
        return this.props.issuedBy;
    }

    get issuedDate(): Date | undefined {
        return this.props.issuedDate;
    }

    get expiryDate(): Date | undefined {
        return this.props.expiryDate;
    }

    get certificateNumber(): string | undefined {
        return this.props.certificateNumber;
    }

    get description(): string | undefined {
        return this.props.description;
    }

    get type(): string {
        return this.props.type;
    }

    get status(): Status {
        return this.props.status;
    }

    get sortOrder(): number {
        return this.props.sortOrder;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    get deletedAt(): Date | undefined {
        return this.props.deletedAt;
    }

    // Business methods
    /**
     * Check if certificate is active
     */
    isActive(): boolean {
        return this.props.status.isActive() && !this.props.deletedAt;
    }

    /**
     * Check if certificate is expired
     */
    isExpired(): boolean {
        if (!this.props.expiryDate) {
            return false;
        }
        return this.props.expiryDate < new Date();
    }

    /**
     * Activate certificate
     */
    activate(): void {
        this.props.status = Status.active();
        this.props.updatedAt = new Date();
    }

    /**
     * Deactivate certificate
     */
    deactivate(): void {
        this.props.status = Status.inactive();
        this.props.updatedAt = new Date();
    }

    /**
     * Soft delete certificate
     */
    softDelete(): void {
        this.props.deletedAt = new Date();
        this.props.updatedAt = new Date();
    }

    /**
     * Update certificate details
     */
    updateDetails(data: {
        name?: string;
        image?: string;
        issuedBy?: string;
        issuedDate?: Date;
        expiryDate?: Date;
        certificateNumber?: string;
        description?: string;
        type?: string;
    }): void {
        if (data.name !== undefined) {
            if (!data.name || data.name.trim().length === 0) {
                throw new ValidationException('Certificate name is required');
            }
            this.props.name = data.name;
        }

        if (data.image !== undefined) {
            if (!data.image || data.image.trim().length === 0) {
                throw new ValidationException('Certificate image is required');
            }
            this.props.image = data.image;
        }

        if (data.issuedBy !== undefined) {
            this.props.issuedBy = data.issuedBy;
        }

        if (data.issuedDate !== undefined) {
            this.props.issuedDate = data.issuedDate;
        }

        if (data.expiryDate !== undefined) {
            // Validate expiry date is after issued date
            if (this.props.issuedDate && data.expiryDate < this.props.issuedDate) {
                throw new ValidationException('Expiry date must be after issued date');
            }
            this.props.expiryDate = data.expiryDate;
        }

        if (data.certificateNumber !== undefined) {
            this.props.certificateNumber = data.certificateNumber;
        }

        if (data.description !== undefined) {
            this.props.description = data.description;
        }

        if (data.type !== undefined) {
            this.props.type = data.type;
        }

        this.props.updatedAt = new Date();
    }

    /**
     * Update sort order
     */
    updateSortOrder(sortOrder: number): void {
        this.props.sortOrder = sortOrder;
        this.props.updatedAt = new Date();
    }

    /**
     * Convert to plain object for serialization
     */
    toObject(): any {
        return {
            id: this.id,
            name: this.props.name,
            image: this.props.image,
            issuedBy: this.props.issuedBy,
            issuedDate: this.props.issuedDate,
            expiryDate: this.props.expiryDate,
            certificateNumber: this.props.certificateNumber,
            description: this.props.description,
            type: this.props.type,
            status: this.props.status.value,
            sortOrder: this.props.sortOrder,
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
            deletedAt: this.props.deletedAt,
        };
    }
}
