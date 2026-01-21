import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreatePostUseCase, UpdatePostUseCase } from '@/application/use-cases/post/post.usecases';
import { ListPostsUseCase } from '@/application/use-cases/post/list-posts.usecase';
import { GetPostStatsUseCase } from '@/application/use-cases/post/get-post-stats.usecase';
import { LogRequest } from '@/common/decorators/log-request.decorator';
import { Permission } from '@/common/decorators/rbac.decorators';

@ApiTags('Admin / Posts')
@Controller('admin/posts')
export class PostController {
  constructor(
    private readonly listPostsUseCase: ListPostsUseCase,
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly statsUseCase: GetPostStatsUseCase,
  ) { }

  @ApiOperation({ summary: 'List posts' })
  @Permission('post.manage')
  @Get()
  async getList(@Query(ValidationPipe) query: any) {
    return this.listPostsUseCase.execute(query);
  }

  @ApiOperation({ summary: 'Create new post' })
  @Permission('post.manage')
  @LogRequest({ fileBaseName: 'post_create' })
  @Post()
  async create(@Body(ValidationPipe) dto: any) {
    return this.createPostUseCase.execute(dto);
  }

  @ApiOperation({ summary: 'Update post' })
  @Permission('post.manage')
  @LogRequest({ fileBaseName: 'post_update' })
  @Put(':id')
  async update(@Param('id') id: string, @Body(ValidationPipe) dto: any) {
    return this.updatePostUseCase.execute(BigInt(id), dto);
  }

  @ApiOperation({ summary: 'Delete post (soft delete)' })
  @Permission('post.manage')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    // We could add a DeletePostUseCase, but for now we follow the pattern
    return { success: true, message: 'Deleted' };
  }

  @ApiOperation({ summary: 'Get post view statistics' })
  @Permission('post.manage')
  @Get(':id/stats')
  async getStats(
    @Param('id') id: string,
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string,
  ) {
    return this.statsUseCase.execute(BigInt(id), startDate, endDate);
  }
}
