import { PaginationMeta } from '@/common/base/utils/pagination.helper';

export interface IPaginationOptions {
    page?: number;
    limit?: number;
    sort?: string;
    // Generic filter object, implementation specific but kept abstract here
    filter?: Record<string, any>;
}

export interface IPaginatedResult<T> {
    data: T[];
    meta: PaginationMeta;
}

export interface IRepository<T> {
    findAll(options?: IPaginationOptions): Promise<IPaginatedResult<T>>;
    findById(id: string | number | bigint): Promise<T | null>;
    findOne(filter: Record<string, any>): Promise<T | null>;
    create(data: any): Promise<T>;
    update(id: string | number | bigint, data: any): Promise<T>;
    delete(id: string | number | bigint): Promise<boolean>;

    findMany(options?: {
        where?: any;
        orderBy?: any;
        take?: number;
        skip?: number;
        include?: any;
        select?: any;
    }): Promise<T[]>;

    findFirst(options?: {
        where?: any;
        orderBy?: any;
        include?: any;
        select?: any;
    }): Promise<T | null>;

    count(where?: any): Promise<number>;
    deleteMany(where: any): Promise<{ count: number }>;
}

