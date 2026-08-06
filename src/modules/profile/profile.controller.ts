import {  Controller,  Patch,  Get,  Body,  UseInterceptors,  UploadedFile,  UseGuards,  Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiExtraModels, getSchemaPath, ApiBearerAuth } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { avatarMulterConfig } from 'src/common/config/avatar-multer.config';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: "Profil ma'lumotlarini ko'rish" })
  getProfile(@Req() req: any) {
    const userId = req.user.id;
    return this.profileService.getProfile(userId);
  }

  @Patch()
  @ApiOperation({
    summary:
      "Profil ma'lumotlarini yangilash (email qo'shish, ism/tel o'zgartirish, avatar yuklash)",
  })
  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(UpdateProfileDto)
  @ApiBody({
    schema: {
      allOf: [
        { $ref: getSchemaPath(UpdateProfileDto) },
        {
          type: 'object',
          properties: {
            avatar: { type: 'string', format: 'binary' },
          },
        },
      ],
    },
  })
  @UseInterceptors(FileInterceptor('avatar', avatarMulterConfig))
 updateProfile(
  @Req() req: any,
  @Body() dto: UpdateProfileDto,
  @UploadedFile() avatar?: Express.Multer.File,
) {
  console.log('req.user:', req.user); // 👈 vaqtincha qo'shing
  const userId = req.user.id;
  return this.profileService.updateProfile(userId, dto, avatar);
}
}