import { Module } from '@nestjs/common';
import { PublicProjectService } from '@/modules/project/public/project/services/project.service';
import { PublicProjectController } from '@/modules/project/public/project/controllers/project.controller';

@Module({
  imports: [],
  controllers: [PublicProjectController],
  providers: [PublicProjectService],
  exports: [PublicProjectService],
})
export class PublicProjectModule { }

