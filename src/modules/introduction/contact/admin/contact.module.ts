import { Module } from '@nestjs/common';
import { ContactService } from '@/modules/introduction/contact/admin/services/contact.service';
import { ContactController } from '@/modules/introduction/contact/admin/controllers/contact.controller';

@Module({
  imports: [],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
})
export class AdminContactModule {}

