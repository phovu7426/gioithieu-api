import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { IEmailConfigRepository, EMAIL_CONFIG_REPOSITORY } from '@/modules/common/system-config/repositories/email-config.repository.interface';
import { UpdateEmailConfigDto } from '../dtos/update-email-config.dto';

@Injectable()
export class EmailConfigService {
  constructor(
    @Inject(EMAIL_CONFIG_REPOSITORY)
    private readonly emailConfigRepo: IEmailConfigRepository
  ) { }

  async getConfig(): Promise<any> {
    const config = await this.emailConfigRepo.getConfig();
    if (!config) return null;

    // Trả về config nhưng mask password
    return this.transform(config, true);
  }

  /**
   * Cập nhật cấu hình email
   * Nếu chưa có thì tạo mới, nếu có thì update
   * Password sẽ được hash trước khi lưu
   * Nếu không gửi password thì giữ nguyên password cũ
   */
  async updateConfig(dto: UpdateEmailConfigDto, updatedBy?: number): Promise<any> {
    const existing = await this.emailConfigRepo.getConfig();

    const updateData: any = { ...dto };

    // Nếu có password mới, hash nó
    if (dto.smtp_password) {
      updateData.smtp_password = await bcrypt.hash(dto.smtp_password, 10);
    } else if (existing) {
      // Nếu không gửi password, giữ nguyên password cũ
      delete updateData.smtp_password;
    }

    let result: any;

    if (!existing) {
      const defaultPassword = dto.smtp_password ? updateData.smtp_password : await bcrypt.hash('', 10);
      result = await this.emailConfigRepo.create({
        smtp_host: dto.smtp_host || 'smtp.gmail.com',
        smtp_port: dto.smtp_port || 587,
        smtp_secure: dto.smtp_secure !== undefined ? dto.smtp_secure : true,
        smtp_username: dto.smtp_username || '',
        smtp_password: defaultPassword,
        from_email: dto.from_email || '',
        from_name: dto.from_name || '',
        reply_to_email: dto.reply_to_email,
        created_user_id: updatedBy ? BigInt(updatedBy) : null,
        updated_user_id: updatedBy ? BigInt(updatedBy) : null,
      });
    } else {
      result = await this.emailConfigRepo.update(existing.id, {
        ...updateData,
        updated_user_id: updatedBy ? BigInt(updatedBy) : existing.updated_user_id,
      });
    }

    return this.transform(result, true);
  }

  private transform(config: any, maskPassword = false) {
    if (!config) return config;
    const item = { ...config };
    if (item.id) item.id = Number(item.id);
    if (item.created_user_id) item.created_user_id = Number(item.created_user_id);
    if (item.updated_user_id) item.updated_user_id = Number(item.updated_user_id);

    if (maskPassword && item.smtp_password) {
      item.smtp_password = '******';
    }
    return item;
  }
}
