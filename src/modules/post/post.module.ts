import { Module } from '@nestjs/common';
import { PostRepositoryModule } from './post.repository.module';

// Import shared services
import { PostService } from '@/modules/post/admin/post/services/post.service';
import { PostCategoryService } from '@/modules/post/admin/post-category/services/post-category.service';
import { PostTagService } from '@/modules/post/admin/post-tag/services/post-tag.service';
import { AdminPostCommentService } from '@/modules/post/admin/comment/services/comment.service';
import { PostCommentService } from '@/modules/post/public/comment/services/comment.service';
import { PostViewCronService } from '@/modules/post/cron/post-view-cron.service';

// Import admin modules
import { AdminPostModule } from '@/modules/post/admin/post/post.module';
import { AdminPostCategoryModule } from '@/modules/post/admin/post-category/post-category.module';
import { AdminPostTagModule } from '@/modules/post/admin/post-tag/post-tag.module';

// Import public modules
import { PublicPostModule } from '@/modules/post/public/post/post.module';
import { PublicPostCategoryModule } from '@/modules/post/public/post-category/post-category.module';
import { PublicPostTagModule } from '@/modules/post/public/post-tag/post-tag.module';
import { AdminPostCommentModule } from '@/modules/post/admin/comment/comment.module';
import { PublicPostCommentModule } from '@/modules/post/public/comment/comment.module';

@Module({
  imports: [
    PostRepositoryModule,
    // Admin modules
    AdminPostModule,
    AdminPostCategoryModule,
    AdminPostTagModule,
    // Public modules
    PublicPostModule,
    PublicPostCategoryModule,
    PublicPostTagModule,
    AdminPostCommentModule,
    PublicPostCommentModule,
  ],
  providers: [
    // Shared services
    PostService,
    PostCategoryService,
    PostTagService,
    AdminPostCommentService,
    PostCommentService,
    PostViewCronService,
  ],
  exports: [
    // Export shared services for other modules to use
    PostService,
    PostCategoryService,
    PostTagService,
    AdminPostCommentService,
    PostCommentService,
  ],
})
export class PostModule { }