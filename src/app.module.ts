import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';

// Core Modules
import { CoreModule } from '@/core/core.module';
import { CommonModule } from '@/common/common.module';

// Core Services
import { CustomLoggerService } from '@/core/logger/logger.service';

// Common Filters, Interceptors, Guards
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import { QueryFailedFilter } from '@/common/filters/query-failed.filter';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor';
import { TimeoutInterceptor } from '@/common/interceptors/timeout.interceptor';
import { FilePathInterceptor } from '@/common/interceptors/file-path.interceptor';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { AuthModule } from '@/modules/common/auth/auth.module';
import { RbacModule } from '@/modules/rbac/rbac.module';
import { RbacGuard } from '@/common/guards/rbac.guard';
import { RequestContextMiddleware } from '@/common/middlewares/request-context.middleware';
import { RateLimitModule } from '@/core/security/throttler.module';
import { ContextModule } from '@/modules/context/context.module';
import { GroupInterceptor } from '@/common/interceptors/group.interceptor';

// New Domain Modules
import { NotificationModule } from '@/modules/extra/notification/notification.module';
import { UserManagementModule } from '@/modules/common/user-management/user-management.module';
import { EnumModule } from '@/shared/enums';
import { FileUploadModule } from '@/modules/common/file-upload/file-upload.module';
import { MenuModule } from '@/modules/common/menu/menu.module';
import { BannerModule } from '@/modules/extra/banner/banner.module';
import { ContactModule } from '@/modules/contact/contact.module';
import { SystemConfigModule } from '@/modules/common/system-config/system-config.module';
import { AppMailModule } from '@/core/mail/mail.module';
import { ProjectModule } from '@/modules/introduction/project/project.module';
import { AboutModule } from '@/modules/common/about/about.module';
import { StaffModule } from '@/modules/introduction/staff/staff.module';
import { TestimonialModule } from '@/modules/introduction/testimonial/testimonial.module';
import { PartnerModule } from '@/modules/introduction/partner/partner.module';
import { GalleryModule } from '@/modules/introduction/gallery/gallery.module';
import { CertificateModule } from '@/modules/introduction/certificate/certificate.module';
import { FaqModule } from '@/modules/common/faq/faq.module';
import { HomepageModule } from '@/modules/homepage/homepage.module';

@Module({
  imports: [
    CoreModule,
    CommonModule,
    RateLimitModule, // Global rate limiting
    AuthModule,
    RbacModule,
    ContextModule,
    // New Domain Modules
    NotificationModule,
    UserManagementModule,
    EnumModule,
    FileUploadModule,
    MenuModule,
    BannerModule,
    ContactModule,
    SystemConfigModule,
    AppMailModule,
    // Introduction Modules - Phase 1
    ProjectModule,
    AboutModule,
    StaffModule,
    // Introduction Modules - Phase 2
    TestimonialModule,
    PartnerModule,
    GalleryModule,
    // Introduction Modules - Phase 3
    CertificateModule,
    FaqModule,
    // Homepage Module - Gộp tất cả API cho trang chủ
    HomepageModule,
  ],
  controllers: [],
  providers: [
    CustomLoggerService,
    // Global Exception Filters
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: QueryFailedFilter,
    },
    // Global Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: FilePathInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GroupInterceptor,
    },
    // Global Guards
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RbacGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}

