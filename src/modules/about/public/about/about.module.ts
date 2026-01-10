import { Module } from '@nestjs/common';
import { PublicAboutService } from '@/modules/about/public/about/services/about.service';
import { PublicAboutController } from '@/modules/about/public/about/controllers/about.controller';

@Module({
  imports: [],
  controllers: [PublicAboutController],
  providers: [PublicAboutService],
  exports: [PublicAboutService],
})
export class PublicAboutModule { }

