import { Module } from '@nestjs/common';
import { PublicAboutService } from '@/modules/common/about/public/services/about.service';
import { PublicAboutController } from '@/modules/common/about/public/controllers/about.controller';

@Module({
  imports: [],
  controllers: [PublicAboutController],
  providers: [PublicAboutService],
  exports: [PublicAboutService],
})
export class PublicAboutModule { }

