import { Module } from '@nestjs/common';
import { PostController as AdminPostController } from './admin/post/controllers/post.controller';
import { PostRepositoryModule } from '@/infrastructure/persistence/prisma/repositories/post-repository.module';
import { CreatePostUseCase, UpdatePostUseCase } from '@/application/use-cases/post/post.usecases';
import { ListPostsUseCase } from '@/application/use-cases/post/list-posts.usecase';
import { GetPostStatsUseCase } from '@/application/use-cases/post/get-post-stats.usecase';

@Module({
  imports: [PostRepositoryModule],
  controllers: [AdminPostController],
  providers: [
    CreatePostUseCase,
    UpdatePostUseCase,
    ListPostsUseCase,
    GetPostStatsUseCase,
  ],
  exports: [CreatePostUseCase, UpdatePostUseCase, ListPostsUseCase, GetPostStatsUseCase],
})
export class PostModule { }