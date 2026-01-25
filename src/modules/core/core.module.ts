import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RbacModule } from './rbac/rbac.module';
import { ContextModule } from './context/context.module';
import { NotificationModule } from './notification/notification.module';
import { UserManagementModule } from './iam/user-management.module';
import { MenuModule } from './menu/menu.module';
import { SystemConfigModule } from './system-config/system-config.module';
import { ContentTemplateModule } from './content-template/content-template.module';

@Module({
    imports: [
        AuthModule,
        RbacModule,
        ContextModule,
        NotificationModule,
        UserManagementModule,
        MenuModule,
        SystemConfigModule,
        ContentTemplateModule,
    ],
    exports: [
        AuthModule,
        RbacModule,
        ContextModule,
        NotificationModule,
        UserManagementModule,
        MenuModule,
        SystemConfigModule,
        ContentTemplateModule,
    ],
})
export class CoreModulesModule { }
