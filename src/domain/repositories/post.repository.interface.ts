import { IBaseRepository } from '@/common/base/repository/base.repository.interface';
import { Post } from '@/domain/models/post.model';

export interface IPostRepository extends IBaseRepository<Post, bigint> {
    /**
     * Find a post by its slug
     */
    findBySlug(slug: string): Promise<Post | null>;

    /**
     * Find published posts with pagination
     */
    findPublished(options: {
        page: number;
        limit: number;
        categoryId?: bigint;
        tagId?: bigint;
        search?: string;
    }): Promise<{
        items: Post[];
        total: number;
    }>;

    /**
     * Find featured posts
     */
    findFeatured(limit: number): Promise<Post[]>;

    /**
     * Admin: Find all posts with pagination and extensive filters
     */
    findWithPagination(options: {
        page: number;
        limit: number;
        status?: string;
        categoryId?: bigint;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        items: Post[];
        total: number;
        page: number;
        limit: number;
        lastPage: number;
    }>;

    /**
     * Sync view count from Redis to DB (Level 3 optimization)
     */
    updateViewCount(id: bigint, count: bigint): Promise<void>;
}
