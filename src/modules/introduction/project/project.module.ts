import { Module } from '@nestjs/common';
import { AdminProjectModule } from './admin/project.module';

@Module({
  imports: [AdminProjectModule],
  exports: [AdminProjectModule],
})
export class ProjectModule { }
