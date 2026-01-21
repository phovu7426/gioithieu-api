import { Injectable, Inject } from '@nestjs/common';
import { IGeneralConfigRepository, GENERAL_CONFIG_REPOSITORY } from '@/modules/core/system-config/repositories/general-config.repository.interface';
import { CacheService } from '@/common/services/cache.service';
import { BaseService } from '@/common/base/services';

@Injectable()
export class PublicGeneralConfigService extends BaseService<any, IGeneralConfigRepository> {
  private readonly CACHE_KEY = 'public:general-config';
  private readonly CACHE_TTL = 3600; // 1 hour

  constructor(
    @Inject(GENERAL_CONFIG_REPOSITORY)
    private readonly generalConfigRepo: IGeneralConfigRepository,
    private readonly cacheService: CacheService,
  ) {
    super(generalConfigRepo);
  }

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
}
