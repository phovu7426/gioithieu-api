import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateContactUseCase } from '@/application/use-cases/introduction/contact/commands/create-contact/create-contact.usecase';
import { CreateContactDto } from '@/application/use-cases/introduction/contact/commands/create-contact/create-contact.dto';
import { Permission } from '@/common/decorators/rbac.decorators';
import { LogRequest } from '@/common/decorators/log-request.decorator';

@ApiTags('Public / Contact')
@Controller('public/contacts')
export class PublicContactController {
  constructor(private readonly createUseCase: CreateContactUseCase) { }

  @ApiOperation({ summary: 'Send a contact message' })
  @Permission('public')
  @LogRequest()
  @Post()
  create(@Body(ValidationPipe) dto: CreateContactDto) {
    return this.createUseCase.execute(dto);
  }
}

