import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IPostRepository } from '@/domain/repositories/post.repository.interface';
import { Post } from '@/domain/models/post.model';
import { PostStatus } from '@/domain/value-objects/post-status.vo';

@Injectable()
export class CreatePostUseCase {
    constructor(@Inject('IPostRepository') private readonly postRepo: IPostRepository) { }
    async execute(dto: any) {
        const post = Post.create(0n, {
            ...dto,
            status: PostStatus.fromString(dto.status || 'draft'),
            isFeatured: dto.isFeatured || false,
            viewCount: 0n,
            categoryIds: dto.categoryIds || [],
            tagIds: dto.tagIds || [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const saved = await this.postRepo.save(post);
        return saved.toObject();
    }
}

@Injectable()
export class UpdatePostUseCase {
    constructor(@Inject('IPostRepository') private readonly postRepo: IPostRepository) { }
    async execute(id: bigint, dto: any) {
        const post = await this.postRepo.findById(id);
        if (!post) throw new NotFoundException('Post not found');

        post.updateDetails({
            ...dto,
            status: dto.status ? PostStatus.fromString(dto.status) : undefined,
        });

        const updated = await this.postRepo.update(post);
        return updated.toObject();
    }
}
