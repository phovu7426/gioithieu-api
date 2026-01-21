import { Entity } from '@/common/base/domain/entity.base';
import { AggregateRoot } from '@/common/base/domain/aggregate-root.base';

export interface IContactProps {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    status: string;
    reply?: string;
    repliedAt?: Date;
    createdAt: Date;
}

export class Contact extends Entity<bigint> {
    private props: IContactProps;
    private constructor(id: bigint, props: IContactProps) { super(id); this.props = props; }
    static create(id: bigint, props: IContactProps) { return new Contact(id, props); }
    toObject() { return { id: this.id, ...this.props }; }

    replyTo(message: string): void {
        this.props.reply = message;
        this.props.repliedAt = new Date();
        this.props.status = 'replied';
    }

    markAsRead(): void {
        if (this.props.status === 'new') {
            this.props.status = 'read';
        }
    }

    close(): void {
        this.props.status = 'closed';
    }
}

export interface IAboutSectionProps {
    title: string;
    slug: string;
    content: string;
    image?: string;
    sectionType: string;
    status: string;
    sortOrder: number;
    createdAt: Date;
}

export class AboutSection extends AggregateRoot<bigint> {
    private props: IAboutSectionProps;
    private constructor(id: bigint, props: IAboutSectionProps) { super(id); this.props = props; }
    static create(id: bigint, props: IAboutSectionProps) { return new AboutSection(id, props); }
    toObject() { return { id: this.id, ...this.props }; }

    updateDetails(data: Partial<Omit<IAboutSectionProps, 'id' | 'createdAt'>>): void {
        Object.assign(this.props, data);
    }
}
