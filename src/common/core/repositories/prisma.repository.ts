
import { IRepository, IPaginationOptions, IPaginatedResult } from './repository.interface';
import { createPaginationMeta } from '@/common/core/utils';

// Generic Delegate to cover most Prisma Client Delegates
export type PrismaDelegate = {
    findMany: (args: any) => Promise<any[]>;
    findFirst: (args: any) => Promise<any | null>;
    findUnique?: (args: any) => Promise<any | null>; // Some models use findUnique
    count: (args: any) => Promise<number>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
    delete: (args: any) => Promise<any>;
    deleteMany: (args: any) => Promise<{ count: number }>;
};

export abstract class PrismaRepository<
    Model,
    WhereInput = any,
    CreateInput = any,
    UpdateInput = any,
    OrderByInput = any
> implements IRepository<Model> {

    constructor(
        protected readonly delegate: PrismaDelegate,
        private readonly defaultSort: string = 'created_at:desc'
    ) { }

    /**
     * Must be implemented by subclasses to transform abstract filters to Prisma WhereInput
     */
    protected abstract buildWhere(filter: Record<string, any>): WhereInput;

    /**
     * Helper to parse sort string "field:dir" to Prisma OrderBy
     */
    protected parseSort(sortStr: string): OrderByInput[] {
        const sorts = sortStr.split(',');
        return sorts.map((s) => {
            const [field, dir] = s.split(':');
            return { [field]: dir ? dir.toLowerCase() : 'desc' } as any;
        });
    }

    async findAll(options: IPaginationOptions = {}): Promise<IPaginatedResult<Model>> {
        const page = Math.max(Number(options.page) || 1, 1);
        const limit = Math.max(Number(options.limit) || 10, 1);
        const sort = options.sort || this.defaultSort;
        const filter = options.filter || {};

        const where = this.buildWhere(filter);
        const orderBy = this.parseSort(sort);

        const [data, total] = await Promise.all([
            this.delegate.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.delegate.count({ where }),
        ]);

        return {
            data,
            meta: createPaginationMeta(page, limit, total),
        };
    }

    async findById(id: string | number | bigint): Promise<Model | null> {
        return this.delegate.findFirst({
            where: { id: typeof id === 'bigint' ? id : BigInt(id) } as any,
        });
    }

    async findOne(filter: Record<string, any>): Promise<Model | null> {
        const where = this.buildWhere(filter);
        return this.delegate.findFirst({ where });
    }

    async create(data: CreateInput): Promise<Model> {
        return this.delegate.create({ data });
    }

    async update(id: string | number | bigint, data: UpdateInput): Promise<Model> {
        return this.delegate.update({
            where: { id: typeof id === 'bigint' ? id : BigInt(id) } as any,
            data,
        });
    }

    async delete(id: string | number | bigint): Promise<boolean> {
        try {
            await this.delegate.delete({ where: { id: typeof id === 'bigint' ? id : BigInt(id) } as any });
            return true;
        } catch (e) {
            return false;
        }
    }

    async findMany(options: {
        where?: any;
        orderBy?: any;
        take?: number;
        skip?: number;
        include?: any;
        select?: any;
    } = {}): Promise<Model[]> {
        return this.delegate.findMany(options);
    }

    async findFirst(options: {
        where?: any;
        orderBy?: any;
        include?: any;
        select?: any;
    } = {}): Promise<Model | null> {
        return this.delegate.findFirst(options);
    }

    async count(where?: any): Promise<number> {
        return this.delegate.count({ where });
    }

    async deleteMany(where: any): Promise<{ count: number }> {
        return this.delegate.deleteMany({ where });
    }
}
