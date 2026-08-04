import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { LoginDto, RegisterDto } from "./dtos";
import * as argon from "argon2";
import { JwtService } from "@nestjs/jwt";
import { UserRoles } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(payload: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: {
        phone: payload.phone,
      },
    });

    if (existing) {
      throw new ConflictException(
        "Bunday raqamli foydalanuvchi allaqachon mavjud!",
      );
    }

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
    const existing = await this.prisma.user.findUnique({
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
      access_token: this.jwtService.sign(
        (({ password, ...rest }) => rest)(payload),
      ),
      data: result,
    };
  }

  private async hashPassword(password: string) {
    return await argon.hash(password);
  }

  private async verifyPassword(
    hashedPassword: string,
    originalPassword: string,
  ) {
    return await argon.verify(hashedPassword, originalPassword);
  }
}
