import { Controller, Get, Query, Patch, Param, Body, Delete, UseGuards } from '@nestjs/common';
import { AdminPostCommentService } from '../services/comment.service';
import { RbacGuard } from '@/common/guards/rbac.guard';
import { Permission } from '@/common/decorators/rbac.decorators';

@Controller('admin/post-comments')
@UseGuards(RbacGuard)
export class AdminPostCommentController {
    constructor(private readonly commentService: AdminPostCommentService) { }

    @Get()
    @Permission('post:comment:view')
    async getAllComments(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('sort') sort: string = 'created_at:DESC',
        @Query('status') status?: 'visible' | 'hidden',
        @Query('post_id') postId?: string,
    ) {
        const where: any = { deleted_at: null };
        if (status) where.status = status;
        if (postId) where.post_id = BigInt(postId);

        return this.commentService.getList(where, { page: Number(page), limit: Number(limit), sort });
    }

    @Patch(':id/status')
    @Permission('post:comment:edit')
    async updateStatus(
        @Param('id') id: string,
        @Body('status') status: 'visible' | 'hidden',
    ) {
        return this.commentService.updateCommentStatus(BigInt(id), status);
    }

    @Delete(':id')
    @Permission('post:comment:delete')
    async deleteComment(@Param('id') id: string) {
        return this.commentService.deleteComment(BigInt(id));
    }
}
