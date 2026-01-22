
import { Injectable } from '@nestjs/common';
import { Banner, Prisma } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { PrismaRepository } from '@/common/core/repositories';
import { IBannerRepository, BannerFilter } from './banner.repository.interface';

@Injectable()
export class BannerPrismaRepository extends PrismaRepository<
    Banner,
    Prisma.BannerWhereInput,
    Prisma.BannerCreateInput,
    Prisma.BannerUpdateInput,
    Prisma.BannerOrderByWithRelationInput
> implements IBannerRepository {

    constructor(private readonly prisma: PrismaService) {
        super(prisma.banner as unknown as any, 'sort_order:asc');
        this.defaultSelect = {
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
            where.location_id = this.toPrimaryKey(filter.locationId);
        }

        return where;
    }

    async findAllByLocation(locationCode: string): Promise<Banner[]> {
        return this.findMany({
            location: { code: locationCode },
            status: 'active',
        }, { sort: 'sort_order:asc' });
    }
}
