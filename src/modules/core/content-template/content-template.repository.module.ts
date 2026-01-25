import { Module } from '@nestjs/common';
import { CONTENT_TEMPLATE_REPOSITORY } from './repositories/content-template.repository.interface';
import { ContentTemplatePrismaRepository } from './repositories/content-template.prisma.repository';

@Module({
    providers: [
        {
            provide: CONTENT_TEMPLATE_REPOSITORY,
            useClass: ContentTemplatePrismaRepository,
        },
    ],
    exports: [CONTENT_TEMPLATE_REPOSITORY],
})
export class ContentTemplateRepositoryModule { }
