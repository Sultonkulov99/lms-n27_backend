import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import { MentorService } from "./mentor.service";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRoles } from "@prisma/client";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { CreateMentorDto } from "./dto/mentor-create.dto";
import { UpdateMentorDto } from "./dto/mentor-update.dto";

@Controller("mentors")
export class MentorController {
  constructor(private mentorService: MentorService) { }

  @Get()
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "SUPERADMIN - Get All Mentor" })
  getAll() {
    return this.mentorService.getAll();
  }

  @Get(":id")
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "SUPERADMIN - Get One Mentor" })
  getOne(@Param("id") id: string) {
    return this.mentorService.getOne(Number(id));
  }

  @Post()
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "SUPERADMIN - Create Mentor" })
  create(@Body() dto: CreateMentorDto) {
    return this.mentorService.create(dto);
  }

  // @Put(":id")
  // @Roles(UserRoles.SUPERADMIN)
  // @ApiBearerAuth("access-token")
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @ApiOperation({ summary: "Faqat SUPERADMIN - Update Mentor" })
  // update(@Param("id") id: string, @Body() dto: Partial<CreateMentorDto>) {
  //   return this.mentorService.update(Number(id), dto);
  // }
  @Put(":id")
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "SUPERADMIN - Update Mentor" })
  update(
    @Param("id") id: string,
    @Body() dto: UpdateMentorDto,
  ) {
    return this.mentorService.update(Number(id), dto);
  }

  @Delete(":id")
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "SUPERADMIN - Delete Mentor" })
  remove(@Param("id") id: string) {
    return this.mentorService.remove(Number(id));
  }
}
