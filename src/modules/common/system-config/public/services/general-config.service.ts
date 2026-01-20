import { Injectable, Inject } from '@nestjs/common';
import { IGeneralConfigRepository, GENERAL_CONFIG_REPOSITORY } from '@/modules/common/system-config/repositories/general-config.repository.interface';
import { CacheService } from '@/common/services/cache.service';

@Injectable()
export class PublicGeneralConfigService {
  private readonly CACHE_KEY = 'public:general-config';
  private readonly CACHE_TTL = 3600; // 1 hour

  constructor(
    @Inject(GENERAL_CONFIG_REPOSITORY)
    private readonly generalConfigRepo: IGeneralConfigRepository,
    private readonly cacheService: CacheService,
  ) { }

  /**
   * Lấy cấu hình chung (có cache)
   * Dùng cho public API
   */
  async getConfig(): Promise<any> {
    return this.cacheService.getOrSet<any>(
      this.CACHE_KEY,
      async () => {
        const config = await this.generalConfigRepo.getConfig();
        return this.transform(config);
      },
      this.CACHE_TTL,
    );
  }

  /**
   * Xóa cache (được gọi khi admin update config)
   */
  async clearCache(): Promise<void> {
    await this.cacheService.del(this.CACHE_KEY);
  }

  private transform(config: any) {
    if (!config) return config;
    const item = { ...config };
    if (item.id) item.id = Number(item.id);
    if (item.created_user_id) item.created_user_id = Number(item.created_user_id);
    if (item.updated_user_id) item.updated_user_id = Number(item.updated_user_id);
    return item;
  }
}
