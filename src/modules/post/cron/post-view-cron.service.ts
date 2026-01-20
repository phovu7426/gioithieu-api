import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { RedisUtil } from '@/core/utils/redis.util';

@Injectable()
export class PostViewCronService {
    private readonly logger = new Logger(PostViewCronService.name);
    private readonly BUFFER_KEY = 'post:views:buffer';

    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisUtil,
    ) { }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async syncViews() {
        if (!this.redis.isEnabled()) return;

        this.logger.log('Starting sync post views from Redis to DB...');

        try {
            // 1. Rename the current buffer to a working key to avoid missing updates
            const workingKey = `${this.BUFFER_KEY}:syncing:${Date.now()}`;
            await this.redis.rename(this.BUFFER_KEY, workingKey);

            // 2. Read all data from the working key
            const data = await this.redis.hgetall(workingKey);
            const postIds = Object.keys(data);

            if (postIds.length === 0) {
                this.logger.log('No post views to sync.');
                return;
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // 3. Process each post_id
            for (const postIdStr of postIds) {
                const postId = BigInt(postIdStr);
                const increment = parseInt(data[postIdStr], 10);

                if (isNaN(increment) || increment <= 0) continue;

                // Perform updates in a transaction for data consistency
                await this.prisma.$transaction(async (tx) => {
                    // Update total view_count in Post table
                    await tx.post.update({
                        where: { id: postId },
                        data: { view_count: { increment: increment } },
                    });

                    // Upsert into PostViewStats
                    await (tx as any).postViewStats.upsert({
                        where: {
                            post_id_view_date: {
                                post_id: postId,
                                view_date: today,
                            },
                        },
                        create: {
                            post_id: postId,
                            view_date: today,
                            view_count: increment,
                        },
                        update: {
                            view_count: { increment: increment },
                        },
                    });
                });
            }

            // 4. Delete the working key
            await this.redis.del(workingKey);

            this.logger.log(`Synced views for ${postIds.length} posts.`);
        } catch (error) {
            this.logger.error('Error syncing post views:', error);
        }
    }
}
