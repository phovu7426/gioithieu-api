# Cấu Hình Redis

**Ngày cập nhật:** 2026-01-12  
**Phiên bản:** 1.0.0  
**Package:** ioredis ^5.8.2

---

## 📋 Tổng Quan

Hệ thống đã được tích hợp Redis để hỗ trợ các tính năng:
- **Caching**: Cache dữ liệu để tăng hiệu năng
- **Rate Limiting**: Giới hạn số lượng request từ mỗi IP
- **Token Blacklist**: Quản lý JWT tokens đã bị thu hồi
- **RBAC Permission Caching**: Cache quyền truy cập của user
- **Attempt Limiter**: Giới hạn số lần thử đăng nhập/thao tác

Redis là **optional** - hệ thống có thể hoạt động bình thường mà không cần Redis (với fallback về in-memory storage).

---

## 🔧 Cấu Hình

### 1. Environment Variable

Redis được cấu hình thông qua biến môi trường `REDIS_URL`:

```env
# Redis Connection URL (optional)
# Format: redis://[username]:[password]@[host]:[port]/[database]
# Hoặc: rediss://[username]:[password]@[host]:[port]/[database] (SSL)

# Local development
REDIS_URL=redis://localhost:6379/0

# Với password (không có username)
REDIS_URL=redis://:password@localhost:6379/0

# Với username và password (Redis 6+ ACL hoặc Redis Cloud)
REDIS_URL=redis://username:password@host:port/0

# Redis Labs / Redis Cloud (ví dụ)
REDIS_URL=redis://default:password@redis-12085.c1.asia-northeast1-1.gce.cloud.redislabs.com:12085/0

# Với SSL/TLS
REDIS_URL=rediss://username:password@redis.example.com:6380/0
```

**Lưu ý:**
- `REDIS_URL` là **optional** - nếu không có, hệ thống sẽ hoạt động mà không dùng Redis
- Hỗ trợ cả `redis://` (non-SSL) và `rediss://` (SSL/TLS)
- **Username**: Hỗ trợ từ Redis 6+ với ACL hoặc Redis Cloud (thường là `default`)
- **Database number**: Mặc định là `/0` nếu không chỉ định
- Nếu không có Redis, các tính năng sẽ fallback về in-memory storage

### 2. Validation Schema

Trong `src/core/core.module.ts`, Redis URL được validate:

```typescript
REDIS_URL: Joi.string().uri({ scheme: ['redis', 'rediss'] }).optional()
```

- Chỉ chấp nhận scheme `redis` hoặc `rediss`
- Là optional field

---

## 🏗️ Kiến Trúc

### 1. RedisUtil Service

**File:** `src/core/utils/redis.util.ts`

Service chính để tương tác với Redis:

```typescript
@Injectable()
export class RedisUtil implements OnModuleDestroy {
  private client: RedisClient | null = null;
  private readonly url: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.url = process.env.REDIS_URL || this.configService.get<string>('REDIS_URL');
    if (this.url) {
      this.client = new Redis(this.url, {
        lazyConnect: true,              // Kết nối khi cần
        maxRetriesPerRequest: 2,        // Tối đa 2 lần retry mỗi request
        enableReadyCheck: true,         // Kiểm tra Redis ready trước khi dùng
        retryStrategy: (times) => {
          // Exponential backoff: 200ms, 400ms, 600ms... tối đa 10s
          const delay = Math.min(times * 200, 10_000);
          return delay;
        },
      });
    }
  }
}
```

**Các phương thức:**
- `isEnabled()`: Kiểm tra Redis có được bật không
- `set(key, value, ttlSeconds?)`: Lưu giá trị với TTL tùy chọn
- `get(key)`: Lấy giá trị
- `del(key)`: Xóa key
- `keys(pattern)`: Tìm keys theo pattern

**Đặc điểm:**
- **Lazy Connect**: Kết nối chỉ khi thực sự cần
- **Retry Strategy**: Tự động retry với exponential backoff
- **Graceful Degradation**: Nếu Redis không available, các method sẽ return null/undefined thay vì throw error

### 2. Module Registration

**File:** `src/core/core.module.ts`

RedisUtil được đăng ký trong CoreModule (Global):

```typescript
@Global()
@Module({
  providers: [RedisUtil, TokenBlacklistService, AttemptLimiterService],
  exports: [RedisUtil, TokenBlacklistService, AttemptLimiterService],
})
```

---

## 🎯 Các Tính Năng Sử Dụng Redis

### 1. Caching Service

**File:** `src/common/services/cache.service.ts`

Sử dụng Redis cho caching với fallback về `@nestjs/cache-manager`:

```typescript
@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly redis: RedisUtil,
  ) {}

  async del(key: string): Promise<void> {
    // Ưu tiên dùng Redis nếu có
    if (this.redis?.isEnabled()) {
      await this.redis.del(key);
    }
    // Fallback về cache manager
    await this.cacheManager.del(key);
  }

  async deletePattern(pattern: string): Promise<void> {
    if (this.redis?.isEnabled()) {
      const keys = await this.redis.keys(pattern);
      await Promise.all(keys.map(key => this.redis.del(key)));
    }
  }
}
```

**Sử dụng:**
- Cache dữ liệu homepage (projects, staff, about sections)
- Cache với TTL khác nhau tùy loại dữ liệu
- Hỗ trợ pattern deletion để xóa nhiều keys cùng lúc

### 2. Rate Limiting (Throttler)

**File:** `src/core/security/throttler.module.ts`  
**Storage:** `src/core/security/redis-throttler-storage.service.ts`

Sử dụng Redis để lưu trữ rate limit counters (distributed rate limiting):

```typescript
ThrottlerModule.forRootAsync({
  inject: [RedisUtil],
  useFactory: (redis: RedisUtil) => {
    const storage = redis.isEnabled()
      ? new RedisThrottlerStorageService(redis)
      : undefined; // Fallback to in-memory

    return {
      throttlers: [{
        ttl: 60000,  // 60 seconds = 1 phút
        limit: 50,   // 50 requests mỗi phút cho mỗi IP
      }],
      storage,
    };
  },
})
```

**Đặc điểm:**
- **Distributed**: Rate limit được chia sẻ giữa nhiều instances
- **Blocking**: Tự động block IP khi vượt quá limit
- **Fallback**: Nếu Redis không có, dùng in-memory storage (chỉ hoạt động trong single instance)

**Redis Keys:**
- `throttler:{throttlerName}:{key}`: Counter cho mỗi IP
- `throttler:{throttlerName}:block:{key}`: Block status

### 3. Token Blacklist

**File:** `src/core/security/token-blacklist.service.ts`

Lưu trữ JWT tokens đã bị thu hồi:

```typescript
@Injectable()
export class TokenBlacklistService {
  constructor(
    private readonly redis: RedisUtil,
  ) {}

  async add(token: string, ttlSeconds: number): Promise<void> {
    if (this.redis && this.redis.isEnabled()) {
      await this.redis.set(key, '1', ttlSeconds);
    } else {
      // Fallback to local in-memory map
      this.localMap.set(key, expiresAt);
    }
  }

  async isBlacklisted(token: string): Promise<boolean> {
    if (this.redis && this.redis.isEnabled()) {
      const val = await this.redis.get(key);
      return val === '1';
    }
    // Fallback to local check
    return this.localMap.has(key);
  }
}
```

**Đặc điểm:**
- **Distributed**: Blacklist được chia sẻ giữa nhiều instances
- **TTL**: Tokens tự động expire theo JWT expiration time
- **Fallback**: Local in-memory map với cleanup tự động

**Redis Keys:**
- `blacklist:token:{jti}`: JWT token blacklist (jti = JWT ID)

### 4. RBAC Permission Caching

**File:** `src/modules/rbac/services/rbac-cache.service.ts`

Cache permissions của user để tránh query database mỗi request:

```typescript
@Injectable()
export class RbacCacheService {
  constructor(private readonly redis: RedisUtil) {}

  async getUserPermissions(userId: number, version: number): Promise<number[] | null> {
    if (!this.redis.isEnabled()) return null;
    
    const raw = await this.redis.get(this.userPermsKey(userId, version));
    return raw ? JSON.parse(raw) : null;
  }

  async setUserPermissions(userId: number, version: number, permissions: number[]): Promise<void> {
    if (!this.redis.isEnabled()) return;
    
    await this.redis.set(
      this.userPermsKey(userId, version),
      JSON.stringify(permissions),
      this.ttlSeconds
    );
  }

  async incrementVersion(): Promise<number> {
    if (!this.redis.isEnabled()) return 1;
    
    const val = await this.redis.get(this.versionKey);
    const current = val ? parseInt(val, 10) : 0;
    await this.redis.set(this.versionKey, String(current + 1));
    return current + 1;
  }
}
```

**Đặc điểm:**
- **Version-based Invalidation**: Khi permissions thay đổi, increment version để invalidate cache
- **TTL**: Cache có TTL (mặc định 300s, configurable qua `RBAC_CACHE_TTL`)
- **Fallback**: Nếu không có Redis, query trực tiếp từ database

**Redis Keys:**
- `rbac:version`: Version number để invalidate cache
- `rbac:user:{userId}:v{version}`: Permissions của user ở version cụ thể
- `rbac:role:{roleId}:v{version}`: Permissions của role
- `rbac:permission:{permId}:v{version}`: Permission details

### 5. Attempt Limiter

**File:** `src/core/security/attempt-limiter.service.ts`

Giới hạn số lần thử đăng nhập/thao tác:

```typescript
@Injectable()
export class AttemptLimiterService {
  constructor(private readonly redis: RedisUtil) {}

  async checkAndIncrement(
    scope: string,
    identifier: string,
    maxAttempts: number,
    windowSeconds: number,
    lockoutSeconds: number,
  ): Promise<{ isLocked: boolean; remainingAttempts: number; lockoutUntil?: Date }> {
    if (!this.redis.isEnabled()) return { isLocked: false, remainingAttempts: maxAttempts };

    const key = `${scope}:${identifier}`;
    const data = await this.redis.get(key);
    
    // ... logic check và increment
    
    await this.redis.set(key, JSON.stringify({ attempts, lockedUntil }), ttl);
  }
}
```

**Đặc điểm:**
- **Distributed**: Lockout được chia sẻ giữa nhiều instances
- **Configurable**: Max attempts, window, lockout duration có thể config
- **Fallback**: Nếu không có Redis, không enforce limit

**Redis Keys:**
- `attempt:{scope}:{identifier}`: Attempt counter với lockout info

### 6. Auth Service

**File:** `src/modules/common/auth/services/auth.service.ts`

Sử dụng Redis cho refresh token management:

```typescript
@Injectable()
export class AuthService {
  constructor(private readonly redis: RedisUtil) {}

  async validateRefreshToken(userId: number, jti: string): Promise<boolean> {
    const active = !!(await this.redis.get(this.buildRefreshKey(userId, jti)));
    return active;
  }

  async revokeRefreshToken(userId: number, jti: string): Promise<void> {
    await this.redis.del(this.buildRefreshKey(userId, jti));
  }
}
```

**Redis Keys:**
- `refresh:token:{userId}:{jti}`: Active refresh tokens

---

## 📊 Redis Key Patterns

Tổng hợp các key patterns được sử dụng:

| Pattern | Mục đích | TTL |
|---------|----------|-----|
| `throttler:{name}:{key}` | Rate limit counter | 60s |
| `throttler:{name}:block:{key}` | Rate limit block | Block duration |
| `blacklist:token:{jti}` | JWT blacklist | JWT expiration |
| `rbac:version` | RBAC cache version | Persistent |
| `rbac:user:{userId}:v{version}` | User permissions | 300s (configurable) |
| `rbac:role:{roleId}:v{version}` | Role permissions | 300s |
| `rbac:permission:{permId}:v{version}` | Permission details | 300s |
| `attempt:{scope}:{identifier}` | Attempt limiter | Window + lockout |
| `refresh:token:{userId}:{jti}` | Refresh token | 1 hour |
| `cache:{module}:{key}` | General cache | Varies |

---

## ⚙️ Cấu Hình Chi Tiết

### Connection Options

```typescript
{
  lazyConnect: true,              // Kết nối khi cần, không kết nối ngay khi khởi tạo
  maxRetriesPerRequest: 2,        // Tối đa 2 lần retry mỗi request
  enableReadyCheck: true,         // Kiểm tra Redis ready trước khi execute commands
  retryStrategy: (times) => {
    // Exponential backoff: 200ms, 400ms, 600ms... tối đa 10s
    const delay = Math.min(times * 200, 10_000);
    return delay;
  },
}
```

### Retry Strategy

- **Lần 1**: Retry sau 200ms
- **Lần 2**: Retry sau 400ms
- **Lần 3**: Retry sau 600ms
- ...
- **Tối đa**: 10 giây

### Cleanup

Redis client tự động cleanup khi module destroy:

```typescript
async onModuleDestroy() {
  if (this.client) {
    try {
      await this.client.quit();
    } catch {}
    this.client = null;
  }
}
```

---

## 🚀 Setup Redis

### 1. Local Development (Docker)

```bash
# Chạy Redis container
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:7-alpine

# Hoặc với password
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:7-alpine redis-server --requirepass yourpassword
```

### 2. Production

**Option 1: Redis Cloud (Managed)**
- Redis Cloud
- AWS ElastiCache
- Azure Cache for Redis
- Google Cloud Memorystore

**Option 2: Self-hosted**
- Redis trên server riêng
- Redis Cluster cho high availability
- Redis Sentinel cho failover

### 3. Environment Variables

Thêm vào `.env`:

```env
# Development (local)
REDIS_URL=redis://localhost:6379/0

# Production (với password, không có username)
REDIS_URL=redis://:yourpassword@redis.example.com:6379/0

# Production (với username và password - Redis Cloud/Redis Labs)
REDIS_URL=redis://default:yourpassword@redis-12085.c1.asia-northeast1-1.gce.cloud.redislabs.com:12085/0

# Production (với SSL/TLS)
REDIS_URL=rediss://username:password@redis.example.com:6380/0
```

**Ví dụ cụ thể với Redis Labs:**
```env
# Từ thông tin connection của Redis Labs:
# - Endpoint: redis-12085.c1.asia-northeast1-1.gce.cloud.redislabs.com
# - Port: 12085
# - User: default
# - Password: is6VjESITx311xEbvEhGYJkSkMbVIh1u

REDIS_URL=redis://default:is6VjESITx311xEbvEhGYJkSkMbVIh1u@redis-12085.c1.asia-northeast1-1.gce.cloud.redislabs.com:12085/0
```

**Lưu ý về Redis Labs:**
- Redis Labs thường yêu cầu **username** (thường là `default`)
- Port có thể khác 6379 (ví dụ: 12085)
- Có thể yêu cầu SSL - nếu vậy dùng `rediss://` thay vì `redis://`
- Database number thường là `/0` (có thể bỏ qua nếu dùng database 0)

---

## 🔍 Monitoring & Debugging

### 1. Kiểm Tra Redis Connection

**Trong code:**
```typescript
// Trong service
if (this.redis.isEnabled()) {
  console.log('Redis is enabled');
  
  // Test connection bằng cách set/get một key
  await this.redis.set('test:connection', 'ok', 10);
  const result = await this.redis.get('test:connection');
  console.log('Redis connection test:', result); // Should print: ok
} else {
  console.log('Redis is not enabled - using fallback');
}
```

**Test từ command line (nếu có redis-cli):**
```bash
# Với username và password
redis-cli -h redis-12085.c1.asia-northeast1-1.gce.cloud.redislabs.com -p 12085 -a is6VjESITx311xEbvEhGYJkSkMbVIh1u --user default

# Hoặc với URL
redis-cli -u redis://default:is6VjESITx311xEbvEhGYJkSkMbVIh1u@redis-12085.c1.asia-northeast1-1.gce.cloud.redislabs.com:12085/0

# Test connection
PING
# Should return: PONG
```

### 2. Redis CLI Commands

```bash
# Kết nối Redis
redis-cli

# Hoặc với password
redis-cli -a yourpassword

# Xem tất cả keys
KEYS *

# Xem keys theo pattern
KEYS throttler:*

# Xem giá trị của key
GET rbac:version

# Xem TTL của key
TTL rbac:user:1:v1

# Xóa key
DEL rbac:user:1:v1

# Xóa tất cả keys (cẩn thận!)
FLUSHALL
```

### 3. Monitoring Tools

- **Redis Insight**: GUI tool để monitor Redis
- **redis-cli --stat**: Real-time statistics
- **redis-cli MONITOR**: Monitor all commands

---

## ⚠️ Lưu Ý & Best Practices

### 1. Graceful Degradation

- Hệ thống được thiết kế để hoạt động **không cần Redis**
- Tất cả các service đều có fallback mechanism
- Nếu Redis down, hệ thống vẫn hoạt động (nhưng không có distributed features)

### 2. Key Naming Convention

- Sử dụng prefix rõ ràng: `throttler:`, `rbac:`, `blacklist:`, etc.
- Tránh conflict giữa các modules
- Dễ dàng cleanup theo pattern

### 3. TTL Management

- Luôn set TTL cho các keys (trừ persistent data như version)
- TTL nên match với business logic (JWT expiration, cache invalidation, etc.)
- Tránh memory leak do keys không expire

### 4. Error Handling

- Redis errors được catch và fallback về in-memory/local storage
- Không throw error nếu Redis unavailable
- Log errors trong development mode

### 5. Performance

- Sử dụng `keys()` cẩn thận (có thể slow với nhiều keys)
- Prefer `SCAN` cho production (chưa implement)
- Batch operations với `Promise.all()` khi có thể

### 6. Security

- Sử dụng password cho production
- Sử dụng SSL (`rediss://`) cho remote connections
- Restrict Redis port trong firewall
- Không expose Redis ra internet

---

## 📚 Tài Liệu Tham Khảo

- [ioredis Documentation](https://github.com/redis/ioredis)
- [Redis Best Practices](https://redis.io/docs/manual/patterns/)
- [NestJS Cache Manager](https://docs.nestjs.com/techniques/caching)
- [NestJS Throttler](https://docs.nestjs.com/security/rate-limiting)

---

## 🔄 Migration & Upgrade

### Từ không có Redis sang có Redis

1. Setup Redis server
2. Thêm `REDIS_URL` vào `.env`
3. Restart application
4. Hệ thống tự động sử dụng Redis (không cần code changes)

### Upgrade ioredis

```bash
npm update ioredis
```

Kiểm tra breaking changes trong [ioredis changelog](https://github.com/redis/ioredis/blob/main/CHANGELOG.md).

---

## ❓ FAQ - Câu Hỏi Thường Gặp

### Q1: Tôi có thông tin kết nối Redis Labs, cần làm gì?

**A:** Chỉ cần thêm `REDIS_URL` vào file `.env` với format:

```env
REDIS_URL=redis://default:is6VjESITx311xEbvEhGYJkSkMbVIh1u@redis-12085.c1.asia-northeast1-1.gce.cloud.redislabs.com:12085/0
```

**Format:** `redis://[username]:[password]@[host]:[port]/[database]`

- **Username**: Thường là `default` với Redis Labs
- **Password**: Password từ Redis Labs dashboard
- **Host**: Endpoint từ Redis Labs
- **Port**: Port từ Redis Labs (có thể khác 6379)
- **Database**: Thường là `/0` (có thể bỏ qua nếu dùng database 0)

**Không cần thay đổi code** - hệ thống tự động sử dụng Redis khi có `REDIS_URL`.

### Q2: Redis Labs có yêu cầu SSL không?

**A:** Tùy vào cấu hình của Redis Labs instance:
- Nếu **không có SSL**: Dùng `redis://`
- Nếu **có SSL/TLS**: Dùng `rediss://` (lưu ý có 2 chữ 's')

Kiểm tra trong Redis Labs dashboard hoặc thử cả 2 format.

### Q3: Có cần thêm database number vào URL không?

**A:** 
- **Có thể bỏ qua** nếu dùng database 0 (mặc định)
- **Nên thêm** `/0` để rõ ràng
- Nếu dùng database khác, thay `/0` bằng số database tương ứng

### Q4: Làm sao biết Redis đã kết nối thành công?

**A:** Có 3 cách:

1. **Kiểm tra logs khi start app:**
   - Nếu có Redis: App sẽ kết nối (lazy connect)
   - Nếu không có Redis: App vẫn chạy bình thường với fallback

2. **Test trong code:**
   ```typescript
   if (this.redis.isEnabled()) {
     await this.redis.set('test', 'ok', 10);
     const result = await this.redis.get('test');
     console.log('Redis works:', result); // Should be 'ok'
   }
   ```

3. **Kiểm tra Redis keys:**
   ```bash
   redis-cli -u "redis://default:password@host:port/0" KEYS "*"
   ```

### Q5: Nếu Redis không kết nối được thì sao?

**A:** Hệ thống được thiết kế với **graceful degradation**:
- ✅ App vẫn chạy bình thường
- ✅ Các tính năng fallback về in-memory storage
- ⚠️ Rate limiting chỉ hoạt động trong single instance (không distributed)
- ⚠️ Token blacklist chỉ trong memory (không shared giữa instances)

### Q6: Có cần cấu hình thêm gì không?

**A:** **Không cần** - chỉ cần set `REDIS_URL` là đủ. Hệ thống tự động:
- Parse URL và extract thông tin
- Kết nối với retry strategy
- Handle errors gracefully
- Cleanup khi shutdown

### Q7: Format URL của tôi có đúng không?

**A:** Format bạn đưa ra:
```
redis://default:is6VjESITx311xEbvEhGYJkSkMbVIh1u@redis-12085.c1.asia-northeast1-1.gce.cloud.redislabs.com:12085
```

**Đúng rồi!** Có thể thêm `/0` ở cuối để rõ ràng hơn:
```
redis://default:is6VjESITx311xEbvEhGYJkSkMbVIh1u@redis-12085.c1.asia-northeast1-1.gce.cloud.redislabs.com:12085/0
```

---

**Tài liệu này được tạo tự động dựa trên codebase hiện tại.**

