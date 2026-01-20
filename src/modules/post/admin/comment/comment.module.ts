import { Module } from '@nestjs/common';
import { AdminPostCommentController } from './controllers/comment.controller';
import { AdminPostCommentService } from './services/comment.service';
import { RbacModule } from '@/modules/rbac/rbac.module';

@Module({
    imports: [RbacModule],
    controllers: [AdminPostCommentController],
    providers: [AdminPostCommentService],
    exports: [AdminPostCommentService],
})
export class AdminPostCommentModule { }
