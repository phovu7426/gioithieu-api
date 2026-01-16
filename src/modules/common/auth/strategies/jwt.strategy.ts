import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { RedisUtil } from '@/core/utils/redis.util';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly redis: RedisUtil,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') as string,
      issuer: configService.get<string>('jwt.issuer'),
      audience: configService.get<string>('jwt.audience'),
    });
  }

  async validate(payload: any) {
    const userId = payload.sub;
    const cacheKey = `user:profile:${userId}`;

    // 1. Kiểm tra cache Redis trước
    const cachedUser = await this.redis.get(cacheKey);
    if (cachedUser) {
      try {
        return JSON.parse(cachedUser);
      } catch (e) {
        // Nếu lỗi parse, bỏ qua và load lại từ DB
      }
    }

    // 2. Load thông tin user từ DB nếu cache miss
    const user = await this.prisma.user.findFirst({
      where: { id: BigInt(userId) },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        status: true,
        email_verified_at: true,
        phone_verified_at: true,
        last_login_at: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) return null;

    const userProfile = {
      id: user.id.toString(), // Convert BigInt to string for caching/response
      username: user.username,
      email: user.email,
      phone: user.phone,
      status: user.status,
      email_verified_at: user.email_verified_at,
      phone_verified_at: user.phone_verified_at,
      last_login_at: user.last_login_at,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    // 3. Lưu vào cache (TTL 1 giờ hoặc tùy config)
    // Dùng JSON.stringify sẽ hoạt động tốt vì id đã chuyển sang string
    await this.redis.set(cacheKey, JSON.stringify(userProfile), 3600); // 1 giờ

    return userProfile;
  }
}


