import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import * as fs from 'fs/promises';
import * as path from 'path';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async updateProfile(
    userId: number,
    dto: UpdateProfileDto,
    avatar?: Express.Multer.File,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    if (avatar && user.file) {
      const oldAvatarPath = path.join(process.cwd(), user.file);
      try {
        await fs.access(oldAvatarPath);
        await fs.unlink(oldAvatarPath);
      } catch (error) {
      }
    }

    const updateData: any = {};
    
    if (avatar) {
      updateData.file = `/uploads/avatars/${avatar.filename}`;
    }
    if (dto.fullName !== undefined) {
      updateData.fullName = dto.fullName;
    }
    if (dto.phone !== undefined) {
      updateData.phone = dto.phone;
    }
    if (dto.email !== undefined) {
      updateData.email = dto.email;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return {
      message: 'Profil muvaffaqiyatli yangilandi',
      data: {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        phone: updatedUser.phone,
        email: updatedUser.email,
        file: updatedUser.file,
        role: updatedUser.role,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    return {
      message: 'Profil ma\'lumotlari',
      data: {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        file: user.file,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    };
  }
}
