import { Controller, Get, Post, Body, Param, Delete, UseGuards, NotFoundException, BadRequestException, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @ApiResponse({ status: 400, description: 'Usuário não encontrado' })
    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async findOne(@Request() req): Promise<User> {
        return this.userService.findOne(req)
    }

    @ApiResponse({ status: 400, description: 'Usuário não encontrado' })
    @Delete('my-account')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async remove(@Request() req): Promise<void> {
        return this.userService.remove(req);
    }
}
