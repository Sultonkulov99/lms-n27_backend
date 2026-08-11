import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import * as argon from "argon2";
import { JwtService } from "@nestjs/jwt";
import { UserRoles } from "@prisma/client";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { RedisService } from "src/common/redis/redis.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) { }

  private async hashPassword(password: string) {
    return await argon.hash(password);
  }

  private async verifyPassword(
    hashedPassword: string,
    originalPassword: string,
  ) {
    return await argon.verify(hashedPassword, originalPassword);
  }

  async register(payload: RegisterDto) {
    console.log("Hello")
    const existing = await this.prisma.user.findFirst({
      where: {
        phone: payload.phone,
      },
    });

    if (existing) {
      throw new ConflictException(
        "Bunday raqamli foydalanuvchi allaqachon mavjud!",
      );
    }

    const redisKey = `reg_${payload.phone}`;
    const storedOtp = await this.redisService.get(redisKey);
    if (!storedOtp || storedOtp !== payload.otp) {
      throw new HttpException(
        'Noto\'g\'ri yoki muddati o\'tgan tasdiqlash kodi',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Delete OTP after successful verification to prevent reuse
    await this.redisService.del(redisKey);

    const hashedPassword = await this.hashPassword(payload.password);

    const user = await this.prisma.user.create({
      data: {
        fullName: payload.fullName,
        phone: payload.phone,
        password: hashedPassword,
        role: UserRoles.STUDENT,
      },
    });

    const { password, ...result } = user;

    return {
      success: true,
      data: result,
    };
  }

  async login(payload: LoginDto) {
    const existing = await this.prisma.user.findFirst({
      where: {
        phone: payload.phone,
      },
    });

    if (!existing) {
      throw new NotFoundException("Foydalanuvchi topilmadi");
    }

    const isSame = await this.verifyPassword(
      existing.password,
      payload.password,
    );

    if (!isSame) {
      throw new UnauthorizedException("Parol xato");
    }

    const { password, ...result } = existing;

    return {
      success: true,
      access_token: this.jwtService.sign({ id: existing.id, role: existing.role }, { secret: process.env.SECRET_KEY }),
      data: result,
    };
  }

}
