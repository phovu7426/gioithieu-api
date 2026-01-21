import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { safeUser } from '@/modules/core/auth/utils/user.util';
import { UpdateProfileDto } from '@/modules/core/iam/user/user/dto/update-profile.dto';
import { ChangePasswordDto } from '@/modules/core/iam/user/user/dto/change-password.dto';
import { IUserRepository, USER_REPOSITORY } from '@/modules/core/iam/repositories/user.repository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) { }

  async getByIdSafe(userId: number) {
    if (!userId) return null;
    const user = await this.userRepo.findById(userId);
    if (!user) return null;
    return safeUser(user as any);
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    if (!userId) throw new BadRequestException('Không thể cập nhật thông tin user');

    const user = await this.userRepo.findById(userId);
    if (!user) throw new BadRequestException('Không thể cập nhật thông tin user');

    // Unique check phone nếu cung cấp
    if (dto.phone) {
      const isUnique = await this.userRepo.checkUnique('phone', dto.phone, userId);
      if (!isUnique) {
        throw new BadRequestException('Số điện thoại đã được sử dụng.');
      }
    }

    // Cập nhật bảng users
    const userPatch: any = {};
    if (dto.phone !== undefined) userPatch.phone = dto.phone;
    if (dto.name !== undefined) userPatch.name = dto.name;
    if (dto.image !== undefined) userPatch.image = dto.image;

    if (Object.keys(userPatch).length > 0) {
      await this.userRepo.update(userId, userPatch);
    }

    // Cập nhật bảng profiles
    const profilePatch: any = {};
    if (dto.birthday !== undefined) profilePatch.birthday = dto.birthday;
    if (dto.gender !== undefined) profilePatch.gender = dto.gender;
    if (dto.address !== undefined) profilePatch.address = dto.address;
    if (dto.about !== undefined) profilePatch.about = dto.about;

    if (Object.keys(profilePatch).length > 0) {
      await this.userRepo.upsertProfile(userId, profilePatch);
    }

    const updated = await this.userRepo.findById(userId);
    return updated ? safeUser(updated as any) : null;
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.userRepo.findById(userId);
    if (!user || !(user as any).password) throw new BadRequestException('Không thể đổi mật khẩu');

    const ok = await bcrypt.compare(dto.oldPassword, (user as any).password);
    if (!ok) throw new BadRequestException('Mật khẩu hiện tại không đúng');

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepo.update(userId, { password: hashed });

    return null;
  }
}
