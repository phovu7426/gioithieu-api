
import { Injectable } from '@nestjs/common';
import { Banner, Prisma } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { PrismaRepository } from '@/common/base/repository/prisma.repository';
import { IBannerRepository, BannerFilter } from './banner.repository.interface';

@Injectable()
export class BannerPrismaRepository extends PrismaRepository<
    Banner,
    Prisma.BannerWhereInput,
    Prisma.BannerCreateInput,
    Prisma.BannerUpdateInput,
    Prisma.BannerOrderByWithRelationInput
> implements IBannerRepository {
    private readonly defaultSelect: Prisma.BannerSelect = {
        id: true,
        title: true,
        image: true,
        link: true,
        link_target: true,
        status: true,
        sort_order: true,
        location_id: true,
        created_at: true,
        updated_at: true,
        location: { select: { id: true, name: true, code: true } },
    };

    constructor(private readonly prisma: PrismaService) {
        super(prisma.banner as unknown as any, 'sort_order:asc');
    }

    protected buildWhere(filter: BannerFilter): Prisma.BannerWhereInput {
        const where: Prisma.BannerWhereInput = {};

        if (filter.search) {
            where.title = { contains: filter.search };
        }

        if (filter.status) {
            where.status = filter.status as any;
        }

        if (filter.locationId !== undefined && filter.locationId !== null) {
            where.location_id = BigInt(filter.locationId);
        }

        where.deleted_at = null;

        return where;
    }

    override async findAll(options: any): Promise<any> {
        return super.findAll({ ...options, select: this.defaultSelect });
    }

    override async findById(id: string | number | bigint): Promise<Banner | null> {
        return this.prisma.banner.findUnique({
            where: { id: BigInt(id) },
            select: this.defaultSelect as any,
        }) as unknown as Banner;
    }

    async findAllByLocation(locationCode: string): Promise<Banner[]> {
        return this.prisma.banner.findMany({
            where: {
                location: { code: locationCode },
                status: 'active',
                deleted_at: null,
            },
            orderBy: { sort_order: 'asc' },
            select: this.defaultSelect as any,
        }) as unknown as Banner[];
    }
}
