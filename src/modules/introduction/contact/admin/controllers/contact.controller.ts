import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateContactUseCase } from '@/application/use-cases/introduction/contact/commands/create-contact/create-contact.usecase';
import { ReplyToContactUseCase } from '@/application/use-cases/introduction/contact/commands/reply-contact/reply-contact.usecase';
import { MarkContactReadUseCase } from '@/application/use-cases/introduction/contact/commands/mark-read/mark-read.usecase';
import { CloseContactUseCase } from '@/application/use-cases/introduction/contact/commands/close-contact/close-contact.usecase';
import { ListContactsUseCase } from '@/application/use-cases/introduction/contact/queries/admin/list-contacts.usecase';
import { CreateContactDto } from '@/application/use-cases/introduction/contact/commands/create-contact/create-contact.dto';
import { LogRequest } from '@/common/decorators/log-request.decorator';
import { Permission } from '@/common/decorators/rbac.decorators';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RbacGuard } from '@/common/guards/rbac.guard';

import { GetContactUseCase } from '@/application/use-cases/introduction/contact/queries/admin/get-contact.usecase';
import { DeleteContactUseCase } from '@/application/use-cases/introduction/contact/commands/delete-contact/delete-contact.usecase';

@ApiTags('Admin / Introduction / Contact')
@Controller('admin/contacts')
@UseGuards(JwtAuthGuard, RbacGuard)
export class ContactController {
  constructor(
    private readonly listUseCase: ListContactsUseCase,
    private readonly getUseCase: GetContactUseCase,
    private readonly createUseCase: CreateContactUseCase,
    private readonly deleteUseCase: DeleteContactUseCase,
    private readonly replyUseCase: ReplyToContactUseCase,
    private readonly markReadUseCase: MarkContactReadUseCase,
    private readonly closeUseCase: CloseContactUseCase,
  ) { }

  @Permission('contact.manage')
  @LogRequest()
  @Post()
  @ApiOperation({ summary: 'Create new contact' })
  create(@Body(ValidationPipe) dto: CreateContactDto) {
    return this.createUseCase.execute(dto);
  }

  @Permission('contact.manage')
  @Get()
  @ApiOperation({ summary: 'List all contacts' })
  findAll() {
    return this.listUseCase.execute();
  }

  @Permission('contact.manage')
  @Get(':id')
  @ApiOperation({ summary: 'Get contact by ID' })
  findOne(@Param('id') id: string) {
    return this.getUseCase.execute(BigInt(id));
  }

  @Permission('contact.manage')
  @LogRequest()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete contact' })
  remove(@Param('id') id: string) {
    return this.deleteUseCase.execute(BigInt(id));
  }

  @Permission('contact.manage')
  @LogRequest()
  @Put(':id/reply')
  @ApiOperation({ summary: 'Reply to contact' })
  reply(
    @Param('id') id: string,
    @Body('reply') reply: string,
  ) {
    return this.replyUseCase.execute(BigInt(id), reply);
  }

  @Permission('contact.manage')
  @LogRequest()
  @Put(':id/read')
  @ApiOperation({ summary: 'Mark contact as read' })
  markAsRead(@Param('id') id: string) {
    return this.markReadUseCase.execute(BigInt(id));
  }

  @Permission('contact.manage')
  @LogRequest()
  @Put(':id/close')
  @ApiOperation({ summary: 'Close contact' })
  close(@Param('id') id: string) {
    return this.closeUseCase.execute(BigInt(id));
  }
}

