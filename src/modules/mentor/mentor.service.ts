import { PrismaService } from "src/core/database/prisma.service";
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateMentorDto } from "./dto/mentor-create.dto";
import * as argon from "argon2";
import { UpdateCategoryDto } from "../categories/dto/update-category.dto";
import { UpdateMentorDto } from "./dto/mentor-update.dto";
import { UserRoles } from "src/common/enums";

@Injectable()
export class MentorService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const mentor = await this.prisma.user.findMany({
      where: { role: "MENTOR" },
      select: {
        id: true,
        fullName: true,
        phone: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });
    return {
      success: true,
      data: mentor,
    };
  }

  async getOne(id: number) {
    const mentor = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        phone: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!mentor) {
      throw new NotFoundException("Mentor not Found");
    }
    return {
      success: true,
      data: mentor,
    };
  }

  async create(dto: CreateMentorDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        phone: dto.phone,
      },
    });

    if (existingUser) {
      throw new ConflictException("Already registered with this phone number!");
    }

    const hashedPass = await argon.hash(dto.password);

    const mentor = await this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
        password: hashedPass,
        role: "MENTOR",
      },

      select: {
        id: true,
        fullName: true,
        phone: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    return {
      success: true,
      data: mentor,
    };
  }

  async update(id: number, dto: UpdateMentorDto) {
    const mentor = await this.prisma.user.findFirst({
      where: {
        id,
        role: "MENTOR",
      },
    });

    if (!mentor) {
      throw new NotFoundException("Mentor not found");
    }

    if (dto.phone && dto.phone !== mentor.phone) {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          phone: dto.phone,
        },
      });

      if (existingUser) {
        throw new ConflictException("This phone number belongs to other user!");
      }
    }

    if (dto.password) {
      dto.password = await argon.hash(dto.password);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        fullName: true,
        phone: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    return {
      success: true,
      data: updated,
    };
  }

  async remove(id: number) {
    const mentor = await this.prisma.user.findFirst({
      where: {
        id,
        role: UserRoles.MENTOR,
      },
    });

    if (!mentor) {
      throw new NotFoundException("Mentor not found");
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return {
      message: "Mentor successfully deleted!",
    };
  }
}
