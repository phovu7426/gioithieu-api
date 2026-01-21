import { Module } from '@nestjs/common';
import { PostCommentController } from './controllers/comment.controller';
import { PostCommentService } from './services/comment.service';
<<<<<<< HEAD
import { PostRepositoryModule } from '@/modules/post/post.repository.module';
import { RbacModule } from '@/modules/core/rbac/rbac.module';
=======
import { RbacModule } from '@/modules/rbac/rbac.module';
>>>>>>> parent of cf58bf3 (fix repo)

@Module({
    imports: [RbacModule],
    controllers: [PostCommentController],
    providers: [PostCommentService],
    exports: [PostCommentService],
})
export class PublicPostCommentModule { }
