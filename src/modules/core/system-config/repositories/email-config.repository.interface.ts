
import { EmailConfig } from '@prisma/client';
import { IRepository } from '@/common/base/repository/repository.interface';

export const EMAIL_CONFIG_REPOSITORY = 'IEmailConfigRepository';

export interface EmailConfigFilter {
    status?: string;
}

export interface IEmailConfigRepository extends IRepository<EmailConfig> {
    getConfig(): Promise<EmailConfig | null>;
}
