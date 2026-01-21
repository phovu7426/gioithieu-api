import { Module } from '@nestjs/common';
import { ContactController } from '@/modules/introduction/contact/admin/controllers/contact.controller';
import { IntroductionRepositoryModule } from '@/infrastructure/persistence/prisma/repositories/introduction-repository.module';
import { CreateContactUseCase } from '@/application/use-cases/introduction/contact/commands/create-contact/create-contact.usecase';
import { ReplyToContactUseCase } from '@/application/use-cases/introduction/contact/commands/reply-contact/reply-contact.usecase';
import { MarkContactReadUseCase } from '@/application/use-cases/introduction/contact/commands/mark-read/mark-read.usecase';
import { CloseContactUseCase } from '@/application/use-cases/introduction/contact/commands/close-contact/close-contact.usecase';
import { ListContactsUseCase } from '@/application/use-cases/introduction/contact/queries/admin/list-contacts.usecase';
import { GetContactUseCase } from '@/application/use-cases/introduction/contact/queries/admin/get-contact.usecase';
import { DeleteContactUseCase } from '@/application/use-cases/introduction/contact/commands/delete-contact/delete-contact.usecase';

@Module({
  imports: [IntroductionRepositoryModule],
  controllers: [ContactController],
  providers: [
    CreateContactUseCase,
    ReplyToContactUseCase,
    MarkContactReadUseCase,
    CloseContactUseCase,
    ListContactsUseCase,
    GetContactUseCase,
    DeleteContactUseCase,
  ],
  exports: [
    CreateContactUseCase,
    ReplyToContactUseCase,
    MarkContactReadUseCase,
    CloseContactUseCase,
    ListContactsUseCase,
    GetContactUseCase,
    DeleteContactUseCase,
  ],
})
export class AdminContactModule { }

