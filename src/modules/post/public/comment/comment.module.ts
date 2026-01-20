import { Module } from '@nestjs/common';
import { PostCommentController } from './controllers/comment.controller';
import { PostCommentService } from './services/comment.service';
import { RbacModule } from '@/modules/rbac/rbac.module';

@Module({
    imports: [RbacModule],
    controllers: [PostCommentController],
    providers: [PostCommentService],
    exports: [PostCommentService],
})
export class PublicPostCommentModule { }
