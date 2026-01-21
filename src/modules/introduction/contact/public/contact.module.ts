import { Module } from '@nestjs/common';
import { PublicContactController } from '@/modules/introduction/contact/public/controllers/contact.controller';
import { IntroductionRepositoryModule } from '@/infrastructure/persistence/prisma/repositories/introduction-repository.module';
import { CreateContactUseCase } from '@/application/use-cases/introduction/contact/commands/create-contact/create-contact.usecase';

@Module({
  imports: [IntroductionRepositoryModule],
  controllers: [PublicContactController],
  providers: [
    CreateContactUseCase,
  ],
  exports: [
    CreateContactUseCase,
  ],
})
export class PublicContactModule { }

