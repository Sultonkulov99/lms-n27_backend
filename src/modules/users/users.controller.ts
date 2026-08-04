import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UserService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('users')
export class UserController {
    constructor(private readonly service: UserService) { }

    @Get()
    async getAllAdmins() {
        return await this.service.getAllAdmins()
    }

    @Post()
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    async createAdmin(
        @Body() payload: CreateUserDto,
        @UploadedFile()
        image?: Express.Multer.File,
    ) {
        return await this.service.createAdmin(payload, image)
    }

    @Patch(':id')
    async updateAdmin(@Param('id') id: number, @Body() payload: CreateUserDto) {
        return await this.service.updateAdmin(id, payload)
    }

    @Delete(':id')
    async deleteAdmin(@Param('id') id: number) {
        return await this.service.deleteAdmin(id)
    }
}