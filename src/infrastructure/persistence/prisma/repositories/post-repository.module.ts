import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/database/prisma/prisma.module';
import { PostPrismaRepository } from './post.prisma.repository';
import { PostCategoryPrismaRepository } from './post-category.prisma.repository';
import { PostCommentPrismaRepository, PostViewStatsPrismaRepository } from './post-extended.prisma.repository';
import { PostMapper } from '../mappers/post.mapper';
import { PostCategoryMapper } from '../mappers/post-category.mapper';
import { PostCommentMapper, PostViewStatsMapper } from '../mappers/post-extended.mapper';

@Module({
    imports: [PrismaModule],
    providers: [
        PostMapper, PostCategoryMapper, PostCommentMapper, PostViewStatsMapper,
        { provide: 'IPostRepository', useClass: PostPrismaRepository },
        { provide: 'IPostCategoryRepository', useClass: PostCategoryPrismaRepository },
        { provide: 'IPostCommentRepository', useClass: PostCommentPrismaRepository },
        { provide: 'IPostViewStatsRepository', useClass: PostViewStatsPrismaRepository },
    ],
    exports: [
        'IPostRepository', 'IPostCategoryRepository',
        'IPostCommentRepository', 'IPostViewStatsRepository'
    ],
})
export class PostRepositoryModule { }
