import { DomainEvent } from '../base/domain-event.base';

/**
 * Event triggered when a new certificate is created
 */
export class CertificateCreatedEvent extends DomainEvent {
    constructor(
        public readonly certificateId: bigint,
        public readonly certificateName: string,
        public readonly type: string,
    ) {
        super();
    }

    getEventName(): string {
        return 'certificate.created';
    }
}
