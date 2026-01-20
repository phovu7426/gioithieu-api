
import { Module } from '@nestjs/common';
import { PostPrismaRepository } from './repositories/post.prisma.repository';
import { POST_REPOSITORY } from './repositories/post.repository.interface';
import { PostTagPrismaRepository } from './repositories/post-tag.prisma.repository';
import { POST_TAG_REPOSITORY } from './repositories/post-tag.repository.interface';
import { PostCategoryPrismaRepository } from './repositories/post-category.prisma.repository';
import { POST_CATEGORY_REPOSITORY } from './repositories/post-category.repository.interface';
import { PostCommentPrismaRepository } from './repositories/post-comment.prisma.repository';
import { POST_COMMENT_REPOSITORY } from './repositories/post-comment.repository.interface';

@Module({
    providers: [
        {
            provide: POST_REPOSITORY,
            useClass: PostPrismaRepository,
        },
        {
            provide: POST_TAG_REPOSITORY,
            useClass: PostTagPrismaRepository,
        },
        {
            provide: POST_CATEGORY_REPOSITORY,
            useClass: PostCategoryPrismaRepository,
        },
        {
            provide: POST_COMMENT_REPOSITORY,
            useClass: PostCommentPrismaRepository,
        },
    ],
    exports: [POST_REPOSITORY, POST_TAG_REPOSITORY, POST_CATEGORY_REPOSITORY, POST_COMMENT_REPOSITORY],
})
export class PostRepositoryModule { }
