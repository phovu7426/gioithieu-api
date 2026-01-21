import { IBaseRepository } from '@/common/base/repository/base.repository.interface';
import { Project } from '@/domain/models/project.model';

export interface IProjectRepository extends IBaseRepository<Project, bigint> {
    findBySlug(slug: string): Promise<Project | null>;
    findFeatured(limit: number): Promise<Project[]>;
    findActive(): Promise<Project[]>;
}
