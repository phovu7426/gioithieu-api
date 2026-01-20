import { Module } from '@nestjs/common';
import { PostController } from '@/modules/post/public/post/controllers/post.controller';
import { PostService } from '@/modules/post/public/post/services/post.service';
import { RbacModule } from '@/modules/rbac/rbac.module';
import { PostRepositoryModule } from '../../post.repository.module';

@Module({
  imports: [RbacModule, PostRepositoryModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PublicPostModule { }
