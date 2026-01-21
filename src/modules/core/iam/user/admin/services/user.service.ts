import { Injectable, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { RequestContext } from '@/common/utils/request-context.util';
import { RbacService } from '@/modules/core/rbac/services/rbac.service';
import { ChangePasswordDto } from '@/modules/core/iam/user/admin/dtos/change-password.dto';
import { IUserRepository, USER_REPOSITORY, UserFilter } from '@/modules/core/iam/repositories/user.repository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    private readonly rbacService: RbacService,
  ) { }

  async getList(query: any) {
    const filter: UserFilter = {};
    if (query.search) filter.search = query.search;
    if (query.email) filter.email = query.email;
    if (query.phone) filter.phone = query.phone;
    if (query.username) filter.username = query.username;
    if (query.status) filter.status = query.status;

    // Filter by context/group logic
    const context = RequestContext.get<any>('context');
    const contextId = RequestContext.get<number>('contextId') || 1;
    const groupId = RequestContext.get<number | null>('groupId');

    if (context && context.type !== 'system' && contextId !== 1 && groupId) {
      filter.groupId = groupId;
    }

    const result = await this.userRepo.findAll({
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      filter,
    });

    // Transform data
    result.data = this.transformList(result.data);
    return result;
  }

  async getSimpleList(query: any) {
    return this.getList({ ...query, limit: 1000 });
  }

  async getOne(id: number) {
    const user = await this.userRepo.findById(id);
    if (!user) return null;
    return this.transformOne(user);
  }

  async create(data: any) {
    const payload = { ...data };

    // Hash password
    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }

    // Unique Checks
    if (payload.email && !(await this.userRepo.checkUnique('email', payload.email))) {
      throw new BadRequestException('Email đã được sử dụng.');
    }
    if (payload.phone && !(await this.userRepo.checkUnique('phone', payload.phone))) {
      throw new BadRequestException('Số điện thoại đã được sử dụng.');
    }
    if (payload.username && !(await this.userRepo.checkUnique('username', payload.username))) {
      throw new BadRequestException('Tên đăng nhập đã được sử dụng.');
    }

    // Seprate role_ids and profile
    const roleIds = this.normalizeIdArray(payload.role_ids);
    const profileData = payload.profile;
    delete payload.role_ids;
    delete payload.profile;

    // Create User
    const user = await this.userRepo.create(payload);

    // Create Profile
    if (profileData) {
      await this.userRepo.upsertProfile(user.id, profileData);
    }

    // Sync Roles
    if (roleIds && roleIds.length > 0) {
      const groupId = RequestContext.get<number | null>('groupId');
      if (groupId) {
        await this.rbacService.syncRolesInGroup(Number(user.id), groupId, roleIds, true);
      }
    }

    return this.getOne(Number(user.id));
  }

  async update(id: number, data: any) {
    const payload = { ...data };

    // Hash password if present
    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    } else {
      delete payload.password;
    }

    // Unique Checks (exclude current user)
    if (payload.email && !(await this.userRepo.checkUnique('email', payload.email, id))) {
      throw new BadRequestException('Email đã được sử dụng.');
    }
    if (payload.phone && !(await this.userRepo.checkUnique('phone', payload.phone, id))) {
      throw new BadRequestException('Số điện thoại đã được sử dụng.');
    }
    if (payload.username && !(await this.userRepo.checkUnique('username', payload.username, id))) {
      throw new BadRequestException('Tên đăng nhập đã được sử dụng.');
    }

    const roleIds = this.normalizeIdArray(payload.role_ids);
    const profileData = payload.profile;
    delete payload.role_ids;
    delete payload.profile;

    await this.userRepo.update(id, payload);

    if (profileData) {
      await this.userRepo.upsertProfile(id, profileData);
    }

    if (roleIds !== null) { // Only sync if role_ids explicitly provided
      const groupId = RequestContext.get<number | null>('groupId');
      if (groupId) {
        await this.rbacService.syncRolesInGroup(id, groupId, roleIds, true);
      }
    }

    return this.getOne(id);
  }

  async updateById(id: number, data: any) { return this.update(id, data); }

  async delete(id: number) {
    // Logic requirement: delete profile? 
    // UserPrismaRepository doesn't strictly cascade delete unless DB is set up OR we override delete.
    // But assuming repo.delete handles the user deletion.
    // Ideally DB has ON DELETE CASCADE for Profile.
    // Or we should update repository to handle it.
    // For now, calling delete.
    return this.userRepo.delete(id);
  }
  async deleteById(id: number) { return this.delete(id); }

  async changePassword(id: number, dto: ChangePasswordDto) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    const hashed = await bcrypt.hash(dto.password, 10);
    await this.userRepo.update(id, { password: hashed });
  }

  // Helpers
  private normalizeIdArray(input: any): number[] | null {
    if (input === undefined) return null;
    if (!Array.isArray(input)) return [];
    return input.map((id: any) => Number(id)).filter((id) => !Number.isNaN(id));
  }

  private transformOne(user: any) {
    const u = this.transformUser(user);
    return u;
  }

  private transformList(users: any[]) {
    return users.map(u => this.transformUser(u));
  }

  private transformUser(user: any) {
    if (!user) return user;
    const groupId = RequestContext.get<number | null>('groupId');
    const u = { ...user }; // shallow copy

    if (groupId && u.user_role_assignments) {
      u.role_ids = (u.user_role_assignments as any[])
        .filter((ura: any) => ura.group_id === groupId)
        .map((ura: any) => ura.role_id);
    } else {
      u.role_ids = [];
    }

    delete u.user_role_assignments;
    return u;
  }
}
