import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_FILTER, APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';

// Core Modules
import { CoreModule } from '@/core/core.module';
import { CommonModule } from '@/common/common.module';

// Core Services
import { CustomLoggerService } from '@/core/logger/logger.service';

// Common Filters, Interceptors, Guards
import { HttpExceptionFilter } from '@/common/http/filters';
import { QueryFailedFilter } from '@/common/http/filters';
import { TransformInterceptor } from '@/common/http/interceptors';
import { LoggingInterceptor } from '@/common/http/interceptors';
import { TimeoutInterceptor } from '@/common/http/interceptors';
import { FilePathInterceptor } from '@/common/file/interceptors';
import { JwtAuthGuard } from '@/common/auth/guards';
import { AuthModule } from '@/modules/core/auth/auth.module';
import { RbacModule } from '@/modules/core/rbac/rbac.module';
import { RbacGuard } from '@/common/auth/guards';
import { RequestContextMiddleware } from '@/common/http/middlewares';
import { RateLimitModule } from '@/core/security/throttler.module';
import { ContextModule } from '@/modules/core/context/context.module';
import { GroupInterceptor } from '@/common/http/interceptors';

// New Domain Modules
import { PostModule } from '@/modules/post/post.module';
import { NotificationModule } from '@/modules/core/notification/notification.module';
import { UserManagementModule } from '@/modules/core/iam/user-management.module';
import { EnumModule } from '@/shared/enums';
import { FileUploadModule } from '@/modules/storage/file-upload/file-upload.module';
import { MenuModule } from '@/modules/core/menu/menu.module';
import { MarketingModule } from '@/modules/marketing/marketing.module';
import { ContactModule } from '@/modules/introduction/contact/contact.module';
import { SystemConfigModule } from '@/modules/core/system-config/system-config.module';
import { AppMailModule } from '@/core/mail/mail.module';
import { ProjectModule } from '@/modules/introduction/project/project.module';
import { AboutModule } from '@/modules/introduction/about/about.module';
import { StaffModule } from '@/modules/introduction/staff/staff.module';
import { TestimonialModule } from '@/modules/introduction/testimonial/testimonial.module';
import { PartnerModule } from '@/modules/introduction/partner/partner.module';
import { GalleryModule } from '@/modules/introduction/gallery/gallery.module';
import { CertificateModule } from '@/modules/introduction/certificate/certificate.module';
import { FaqModule } from '@/modules/introduction/faq/faq.module';
import { HomepageModule } from '@/modules/homepage/homepage.module';

@Module({
  imports: [
    CoreModule,
    CommonModule,
    ScheduleModule.forRoot(),
    RateLimitModule, // Global rate limiting
    AuthModule,
    RbacModule,
    ContextModule,
    // New Domain Modules
    PostModule,
    NotificationModule,
    UserManagementModule,
    EnumModule,
    FileUploadModule,
    MenuModule,
    MarketingModule,
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

