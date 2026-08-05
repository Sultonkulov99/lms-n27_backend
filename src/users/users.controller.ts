import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { UserService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller('/api/users')
export class UserController {
    constructor(private readonly service: UserService) {}

    @Get()
    async getAllAdmins() {
        return await this.service.getAllAdmins()
    }

    @Post()
    async createAdmin(@Body() payload: CreateUserDto) {
        return await this.service.createAdmin(payload)
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