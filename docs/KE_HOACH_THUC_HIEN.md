# Kế Hoạch Thực Hiện Cải Tiến Ưu Tiên

## 🔴 1. Fix Timing Attack Vulnerability

### Mục Tiêu
Loại bỏ vulnerability timing attack trong password comparison bằng cách luôn thực hiện bcrypt.compare() ngay cả khi user không tồn tại.

### Các Bước Thực Hiện

**Bước 1: Tạo utility function để lấy password hash**
```typescript
// src/modules/core/auth/utils/password.util.ts
import { Injectable } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@/modules/core/iam/repositories/user.repository.interface';
import { Inject } from '@nestjs/common';

@Injectable()
export class PasswordUtil {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async getPasswordHashForUser(email: string): Promise<string> {
    const user = await this.userRepo.findOne({ email: email.toLowerCase() });
    
    // Trả về fake hash nếu user không tồn tại để tránh timing attack
    if (!user || !(user as any).password) {
      return '$2b$10$fakehashforcomparison1234567890123456789012';
    }
    
    return (user as any).password;
  }
}
```

**Bước 2: Cập nhật AuthService**
```typescript
// src/modules/core/auth/services/auth.service.ts
import { PasswordUtil } from '@/modules/core/auth/utils/password.util';

export class AuthService {
  constructor(
    // ... các dependencies khác
    private readonly passwordUtil: PasswordUtil,
  ) {}

  async login(dto: LoginDto) {
    const identifier = dto.email.toLowerCase();
    const scope = 'auth:login';
    const lockout = await this.accountLockoutService.check(scope, identifier);

    if (lockout.isLocked) {
      throw new Error(`Tài khoản đã bị khóa...`);
    }

    // 🔒 FIXED: Luôn thực hiện password comparison để tránh timing attack
    const hashedPassword = await this.passwordUtil.getPasswordHashForUser(identifier);
    const isPasswordValid = await bcrypt.compare(dto.password, hashedPassword);

    // Tìm user để check status và các thông tin khác
    const user = await this.userRepo.findOne({ email: identifier });

    let authError: string | null = null;

    if (!user || !isPasswordValid) {
      await this.accountLockoutService.add(scope, identifier);
      authError = 'Email hoặc mật khẩu không đúng.';
    } else if (user.status !== UserStatus.active) {
      authError = 'Tài khoản đã bị khóa hoặc không hoạt động.';
    }

    if (authError) {
      throw new Error(authError);
    }

    // ... phần còn lại của hàm
  }
}
```

**Bước 3: Cập nhật AuthModule**
```typescript
// src/modules/core/auth/auth.module.ts
@Module({
  imports: [
    // ... các imports khác
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordUtil, // Thêm PasswordUtil vào providers
    // ... các providers khác
  ],
  exports: [AuthService],
})
export class AuthModule { }
```

### Testing Plan
- ✅ Unit test: Kiểm tra PasswordUtil trả về fake hash khi user không tồn tại
- ✅ Unit test: Kiểm tra bcrypt.compare luôn được gọi
- ✅ Integration test: Kiểm tra timing behavior
- ✅ Performance test: Đảm bảo không có performance regression

### Timeline
- **Ước tính**: 2-3 giờ development + testing

---

## 🔴 2. Implement Proper Error Handling

### Mục Tiêu
Thay thế các `throw new Error()` thông thường bằng custom exceptions phù hợp với HTTP status codes.

### Các Bước Thực Hiện

**Bước 1: Tạo custom exceptions**
```typescript
// src/common/shared/exceptions/auth.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthenticationException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class UserNotFoundException extends HttpException {
  constructor(message: string = 'Người dùng không tồn tại') {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class AccountLockedException extends HttpException {
  constructor(remainingMinutes: number) {
    super(
      `Tài khoản đã bị khóa tạm thời. Vui lòng thử lại sau ${remainingMinutes} phút.`,
      HttpStatus.TOO_MANY_REQUESTS
    );
  }
}

export class InvalidTokenException extends HttpException {
  constructor(message: string = 'Token không hợp lệ') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
```

**Bước 2: Tạo validation exceptions**
```typescript
// src/common/shared/exceptions/validation.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(errors: string[] | Record<string, string[]>) {
    super(
      {
        message: 'Dữ liệu không hợp lệ',
        errors: Array.isArray(errors) ? errors : errors,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}

export class EmailAlreadyExistsException extends HttpException {
  constructor() {
    super('Email đã được sử dụng', HttpStatus.CONFLICT);
  }
}

export class UsernameAlreadyExistsException extends HttpException {
  constructor() {
    super('Tên đăng nhập đã được sử dụng', HttpStatus.CONFLICT);
  }
}
```

**Bước 3: Cập nhật AuthService sử dụng custom exceptions**
```typescript
// src/modules/core/auth/services/auth.service.ts
import {
  AuthenticationException,
  AccountLockedException,
  InvalidTokenException,
  UserNotFoundException,
} from '@/common/shared/exceptions/auth.exception';
import {
  EmailAlreadyExistsException,
  UsernameAlreadyExistsException,
} from '@/common/shared/exceptions/validation.exception';

export class AuthService {
  async login(dto: LoginDto) {
    const identifier = dto.email.toLowerCase();
    const scope = 'auth:login';
    const lockout = await this.accountLockoutService.check(scope, identifier);

    if (lockout.isLocked) {
      throw new AccountLockedException(lockout.remainingMinutes); // ✅ Fixed
    }

    // ... password comparison logic

    if (!user || !isPasswordValid) {
      await this.accountLockoutService.add(scope, identifier);
      throw new AuthenticationException('Email hoặc mật khẩu không đúng.'); // ✅ Fixed
    } else if (user.status !== UserStatus.active) {
      throw new AuthenticationException('Tài khoản đã bị khóa hoặc không hoạt động.'); // ✅ Fixed
    }

    // ... phần còn lại của login logic

    return { token: accessToken, refreshToken: refreshToken, expiresIn: accessTtlSec };
  }

  async register(dto: RegisterDto) {
    const existingByEmail = await this.userRepo.findByEmail(dto.email);
    if (existingByEmail) {
      throw new EmailAlreadyExistsException(); // ✅ Fixed
    }

    if (dto.username) {
      const existingByUsername = await this.userRepo.findByUsername(dto.username);
      if (existingByUsername) {
        throw new UsernameAlreadyExistsException(); // ✅ Fixed
      }
    }

    if (dto.phone) {
      const existingByPhone = await this.userRepo.findByPhone(dto.phone);
      if (existingByPhone) {
        throw new ValidationException(['Số điện thoại đã được sử dụng']); // ✅ Fixed
      }
    }

    // ... phần còn lại của register logic
  }

  async logout(userId: number, token?: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UserNotFoundException(); // ✅ Fixed
    }

    // ... phần còn lại của logout logic
  }
}
```

**Bước 4: Cập nhật global exception filter**
```typescript
// src/common/http/filters/http-exception.filter.ts (cần tạo nếu chưa có)
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = exception.getStatus?.() || 500;
    let message = exception.message || 'Internal server error';
    let errors = exception.response?.errors;

    // Format response nhất quán
    response.status(status).json({
      statusCode: status,
      message,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

### Testing Plan
- ✅ Unit test: Kiểm tra các custom exceptions được throw đúng cách
- ✅ Integration test: Kiểm tra HTTP response codes chính xác
- ✅ E2E test: Kiểm tra error responses từ API endpoints

### Timeline
- **Ước tính**: 3-4 giờ development + testing

---

## 🔴 3. Add Comprehensive Testing

### Mục Tiêu
Thêm unit tests, integration tests, và end-to-end tests cho authentication module.

### Các Bước Thực Hiện

**Bước 1: Setup testing environment**
```typescript
// test/jest.config.js
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

// package.json - thêm scripts
"test:auth": "jest src/modules/core/auth --coverage",
"test:watch": "jest --watch",
"test:cov": "jest --coverage"
```

**Bước 2: Tạo test utilities**
```typescript
// test/utils/test.utils.ts
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

export const createTestingModule = async (modules: any[]) => {
  const moduleFixture = await Test.createTestingModule({
    imports: modules,
  }).compile();

  return moduleFixture.createNestApplication();
};

export const closeApp = async (app: INestApplication) => {
  await app.close();
};
```

**Bước 3: Viết unit tests cho AuthService**
```typescript
// src/modules/core/auth/services/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PasswordUtil } from '../utils/password.util';
import { AccountLockedException, AuthenticationException } from '@/common/shared/exceptions/auth.exception';

describe('AuthService', () => {
  let authService: AuthService;
  let passwordUtil: jest.Mocked<PasswordUtil>;
  let userRepo: jest.Mocked<any>;
  let redis: jest.Mocked<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'USER_REPOSITORY',
          useValue: {
            findOne: jest.fn(),
            findByEmail: jest.fn(),
            // ... other methods
          },
        },
        {
          provide: PasswordUtil,
          useValue: {
            getPasswordHashForUser: jest.fn(),
          },
        },
        // ... other mocks
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    passwordUtil = module.get<PasswordUtil>(PasswordUtil);
    userRepo = module.get('USER_REPOSITORY');
  });

  describe('login', () => {
    it('should throw AuthenticationException for invalid credentials', async () => {
      userRepo.findOne.mockResolvedValue(null);
      passwordUtil.getPasswordHashForUser.mockResolvedValue('$2b$10$fakehash');

      await expect(authService.login({
        email: 'wrong@email.com',
        password: 'wrongpassword',
      })).rejects.toThrow(AuthenticationException);
    });

    it('should throw AccountLockedException when account is locked', async () => {
      // Test lockout scenario
    });

    it('should return tokens for valid credentials', async () => {
      // Test successful login
    });
  });

  // ... other test cases
});
```

**Bước 4: Viết integration tests**
```typescript
// test/auth/auth.integration.spec.ts
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestingModule } from '../utils/test.utils';
import { AuthModule } from '@/modules/core/auth/auth.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingModule([AuthModule]);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/login (POST)', () => {
    it('should return 401 for invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'wrong@email.com', password: 'wrong' })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toContain('Email hoặc mật khẩu không đúng');
        });
    });

    it('should return 200 and tokens for valid credentials', async () => {
      // Test with valid user
    });
  });

  // ... other endpoint tests
});
```

**Bước 5: Viết security tests**
```typescript
// test/auth/auth.security.spec.ts
import { AuthService } from '@/modules/core/auth/services/auth.service';

describe('AuthService Security', () => {
  let authService: AuthService;

  beforeEach(() => {
    // Setup
  });

  it('should prevent timing attacks by always comparing passwords', async () => {
    const startTime = Date.now();
    
    // Test with non-existent user
    await expect(authService.login({
      email: 'nonexistent@email.com',
      password: 'anypassword',
    })).rejects.toThrow();

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Timing should be consistent regardless of user existence
    expect(duration).toBeLessThan(100); // Adjust threshold as needed
  });

  it('should use constant time comparison', async () => {
    // Test that bcrypt.compare is always called
  });
});
```

### Testing Coverage Goals
- ✅ AuthService: 90% coverage
- ✅ Controllers: 80% coverage  
- ✅ Utilities: 100% coverage
- ✅ Security: All critical paths tested

### Timeline
- **Ước tính**: 6-8 giờ development + testing

---

## 📋 Tổng Kết Kế Hoạch Thực Hiện

### Thứ Tự Ưu Tiên
1. **🔴 Fix Timing Attack Vulnerability** (2-3 giờ)
   - Cần làm ngay vì security risk cao
2. **🔴 Implement Proper Error Handling** (3-4 giờ)  
   - Cải thiện user experience và API consistency
3. **🔴 Add Comprehensive Testing** (6-8 giờ)
   - Đảm bảo chất lượng và prevent regression

### Tổng Thời Gian Ước Tính
- **Tổng cộng**: 11-15 giờ development và testing
- **Có thể chia thành 3-4 ngày** làm việc

### Resource Requirements
- Developer có kinh nghiệm NestJS và TypeScript
- Testing environment với database và Redis
- Monitoring tools để track performance changes

### Risk Assessment
- **Risk**: Refactoring có thể introduce new bugs
- **Mitigation**: Comprehensive testing và code review
- **Backout Plan**: Git branches và feature flags

---
*Kế hoạch được tạo vào: ${new Date().toLocaleString('vi-VN')}*
