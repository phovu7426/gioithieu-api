import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { SeedRoles } from '@/core/database/seeder/seed-roles';
import { SeedPermissions } from '@/core/database/seeder/seed-permissions';
import { SeedUsers } from '@/core/database/seeder/seed-users';
import { SeedPostCategories } from '@/core/database/seeder/seed-post-categories';
import { SeedPostTags } from '@/core/database/seeder/seed-post-tags';
import { SeedPosts } from '@/core/database/seeder/seed-posts';
// import { SeedShippingMethods } from '@/core/database/seeder/seed-shipping-methods'; // Commented out vì shipping-method đã bị xóa
// import { SeedWarehouses } from '@/core/database/seeder/seed-warehouses';
import { SeedMenus } from '@/core/database/seeder/seed-menus';
import { SeedBannerLocations } from '@/core/database/seeder/seed-banner-locations';
import { SeedBanners } from '@/core/database/seeder/seed-banners';
import { SeedContacts } from '@/core/database/seeder/seed-contacts';
import { SeedGeneralConfigs } from '@/core/database/seeder/seed-general-configs';
import { SeedEmailConfigs } from '@/core/database/seeder/seed-email-configs';
import { SeedGroups } from '@/core/database/seeder/seed-groups';
import { SeedComicCategories } from '@/core/database/seeder/seed-comic-categories';
import { SeedComics } from '@/core/database/seeder/seed-comics';
import { SeedChapters } from '@/core/database/seeder/seed-chapters';
import { SeedComicLastChapter } from '@/core/database/seeder/seed-comic-last-chapter';
import { SeedProjects } from '@/core/database/seeder/seed-projects';
import { SeedAboutSections } from '@/core/database/seeder/seed-about-sections';
import { SeedStaff } from '@/core/database/seeder/seed-staff';
import { SeedTestimonials } from '@/core/database/seeder/seed-testimonials';
import { SeedPartners } from '@/core/database/seeder/seed-partners';
import { SeedGallery } from '@/core/database/seeder/seed-gallery';
import { SeedCertificates } from '@/core/database/seeder/seed-certificates';
import { SeedFaqs } from '@/core/database/seeder/seed-faqs';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly seedPermissions: SeedPermissions,
    private readonly seedRoles: SeedRoles,
    private readonly seedUsers: SeedUsers,
    private readonly seedPostCategories: SeedPostCategories,
    private readonly seedPostTags: SeedPostTags,
    private readonly seedPosts: SeedPosts,
    // private readonly seedShippingMethods: SeedShippingMethods, // Commented out vì shipping-method đã bị xóa
    // private readonly seedWarehouses: SeedWarehouses,
    private readonly seedMenus: SeedMenus,
    private readonly seedBannerLocations: SeedBannerLocations,
    private readonly seedBanners: SeedBanners,
    private readonly seedContacts: SeedContacts,
    private readonly seedGeneralConfigs: SeedGeneralConfigs,
    private readonly seedEmailConfigs: SeedEmailConfigs,
    private readonly seedGroups: SeedGroups,
    private readonly seedComicCategories: SeedComicCategories,
    private readonly seedComics: SeedComics,
    private readonly seedChapters: SeedChapters,
    private readonly seedComicLastChapter: SeedComicLastChapter,
    // Company Introduction Seeders
    private readonly seedProjects: SeedProjects,
    private readonly seedAboutSections: SeedAboutSections,
    private readonly seedStaff: SeedStaff,
    private readonly seedTestimonials: SeedTestimonials,
    private readonly seedPartners: SeedPartners,
    private readonly seedGallery: SeedGallery,
    private readonly seedCertificates: SeedCertificates,
    private readonly seedFaqs: SeedFaqs,
  ) { }

  async seedAll(): Promise<void> {
    this.logger.log('Starting database seeding...');

    try {
      // Seed in order:
      // permissions -> roles -> users -> groups (contexts)
      await this.seedPermissions.seed();
      await this.seedRoles.seed();
      await this.seedUsers.seed();
      await this.seedGroups.seed();

      // blog demo
      await this.seedPostCategories.seed();
      await this.seedPostTags.seed();
      await this.seedPosts.seed();

      // comics demo
      await this.seedComicCategories.seed();
      await this.seedComics.seed();
      await this.seedChapters.seed();
      // Backfill last chapter data sau khi seed chapters
      await this.seedComicLastChapter.seed();

      // ecommerce demo (gắn với group/context nếu có)
      // await this.seedWarehouses.seed(); // Commented out vì liên quan đến product
      // await this.seedShippingMethods.seed(); // Commented out vì shipping-method đã bị xóa
      await this.seedMenus.seed();

      // Banner system
      await this.seedBannerLocations.seed();
      await this.seedBanners.seed();

      // Contact system
      await this.seedContacts.seed();

      // System config
      await this.seedGeneralConfigs.seed();
      await this.seedEmailConfigs.seed();

      // Groups and contexts (sau khi có users và system context)
      await this.seedGroups.seed();

      // Company Introduction Modules
      await this.seedProjects.seed();
      await this.seedAboutSections.seed();
      await this.seedStaff.seed();
      await this.seedPartners.seed();
      await this.seedGallery.seed();
      await this.seedCertificates.seed();
      await this.seedFaqs.seed();
      // Testimonials cần seed sau Projects vì có relation
      await this.seedTestimonials.seed();

      this.logger.log('Database seeding completed successfully');
    } catch (error) {
      this.logger.error('Database seeding failed', error);
      throw error;
    }
  }

  async clearAll(): Promise<void> {
    this.logger.log('Clearing database...');

    try {
      // Clear in reverse order (children first, then parents)
      // Clear junction tables first (many-to-many)
      await this.prisma.postPosttag.deleteMany({});
      await this.prisma.postPostcategory.deleteMany({});
      await this.prisma.comicCategoryOnComic.deleteMany({});
      await this.prisma.userRoleAssignment.deleteMany({});
      await this.prisma.userGroup.deleteMany({});
      await this.prisma.roleHasPermission.deleteMany({});
      await this.prisma.roleContext.deleteMany({});
      await this.prisma.menuPermission.deleteMany({});

      // Clear main tables
      await this.prisma.chapterPage.deleteMany({});
      await this.prisma.chapter.deleteMany({});
      await this.prisma.comicStats.deleteMany({});
      await this.prisma.comic.deleteMany({});
      await this.prisma.comicCategory.deleteMany({});
      
      await this.prisma.post.deleteMany({});
      await this.prisma.postTag.deleteMany({});
      await this.prisma.postCategory.deleteMany({});
      
      await this.prisma.banner.deleteMany({});
      await this.prisma.bannerLocation.deleteMany({});
      
      await this.prisma.contact.deleteMany({});
      
      await this.prisma.menu.deleteMany({});
      
      await this.prisma.notification.deleteMany({});
      
      await this.prisma.group.deleteMany({});
      await this.prisma.context.deleteMany({});
      
      await this.prisma.user.deleteMany({});
      await this.prisma.role.deleteMany({});
      await this.prisma.permission.deleteMany({});
      
      await this.prisma.emailConfig.deleteMany({});
      await this.prisma.generalConfig.deleteMany({});

      // Company Introduction Tables
      await this.prisma.testimonial.deleteMany({});
      await this.prisma.project.deleteMany({});
      await this.prisma.gallery.deleteMany({});
      await this.prisma.certificate.deleteMany({});
      await this.prisma.faq.deleteMany({});
      await this.prisma.partner.deleteMany({});
      await this.prisma.staff.deleteMany({});
      await this.prisma.aboutSection.deleteMany({});

      this.logger.log('Database cleared successfully');
    } catch (error) {
      this.logger.error('Database clearing failed', error);
      throw error;
    }
  }

  async clearDatabase(): Promise<void> {
    this.logger.log('Clearing database...');
    await this.clearAll();
  }
}
