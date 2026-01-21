import { Injectable, Inject } from '@nestjs/common';
import { IGeneralConfigRepository, IEmailConfigRepository } from '@/domain/repositories/core-system.repository.interface';

@Injectable()
export class GetSystemConfigUseCase {
    constructor(
        @Inject('IGeneralConfigRepository') private readonly generalRepo: IGeneralConfigRepository,
        @Inject('IEmailConfigRepository') private readonly emailRepo: IEmailConfigRepository
    ) { }
    async execute() {
        const general = await this.generalRepo.getLatest();
        const email = await this.emailRepo.getLatest();
        return {
            general: general?.toObject(),
            email: email ? { ...email.toObject(), smtpPassword: '***' } : null // Mask password
        };
    }
}
