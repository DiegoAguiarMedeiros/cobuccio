import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @ApiResponse({ status: 400, description: 'Credenciais inválidas' })
    @Post()
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.email, loginDto.password);
    }

    @ApiResponse({ status: 400, description: 'Email já cadastrado' })
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        return this.authService.register(createUserDto);
    }

}
