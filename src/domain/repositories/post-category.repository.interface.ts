import { IBaseRepository } from '@/common/base/repository/base.repository.interface';
import { PostCategory } from '@/domain/models/post-category.model';

export interface IPostCategoryRepository extends IBaseRepository<PostCategory, bigint> {
    findBySlug(slug: string): Promise<PostCategory | null>;
    findActive(): Promise<PostCategory[]>;
    findChildren(parentId: bigint): Promise<PostCategory[]>;
}
