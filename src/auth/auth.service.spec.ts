import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Wallet } from '../wallet/wallet.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

const walletDto: any = {
    id: 1, balance: 0,
    user: new User,
};
const createUserDto: CreateUserDto = {
    name: 'Diego', email: 'diego@example.com', password: 'password',
};
const userDto: User = {
    id: 1, name: 'Diego', email: 'diego@example.com', password: 'password',
    wallet: walletDto
};
const userResponseDto: UserResponseDto = {
    status: 201,
    description: 'Usuário criado com sucesso',
    user: {
        id: userDto.id,
        name: userDto.name,
        email: userDto.email,
        wallet: userDto.wallet.id,
    },
}

describe('AuthService', () => {
    let authService: AuthService;
    let userRepository: Repository<User>;
    let walletRepository: Repository<Wallet>;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(Wallet),
                    useClass: Repository,
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue('token'),
                    },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
        walletRepository = module.get<Repository<Wallet>>(getRepositoryToken(Wallet));
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('register', () => {
        it('should successfully register a user', async () => {

            jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedPassword' as never);
            jest.spyOn(walletRepository, 'create').mockReturnValueOnce(walletDto);
            jest.spyOn(walletRepository, 'save').mockResolvedValueOnce(walletDto);
            jest.spyOn(userRepository, 'create').mockReturnValueOnce({ ...userDto, wallet: walletDto });
            jest.spyOn(userRepository, 'save').mockResolvedValueOnce({ id: 2, ...createUserDto, wallet: walletDto });
            jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);

            const result = await authService.register(createUserDto);

            expect(result).toEqual(userResponseDto);
        });

        it('should throw BadRequestException if email already exists', async () => {

            jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(userDto);

            await expect(authService.register(createUserDto)).rejects.toThrow(BadRequestException);
        });
        it('should throw BadRequestException if email already exists', async () => {

            jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(userDto);

            await expect(authService.register(createUserDto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('login', () => {
        it('should successfully log in a user and return a token', async () => {

            jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(userDto);
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never);

            const result = await authService.login(userDto.email, userDto.password);

            expect(result).toEqual({ accessToken: 'token' });
            expect(jwtService.sign).toHaveBeenCalledWith({ username: userDto.name, id: userDto.id, wallet: userDto.wallet, sub: userDto.id });
        });

        it('should throw BadRequestException if user is not found', async () => {
            jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);

            await expect(authService.login('invalid@example.com', 'password')).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if password is invalid', async () => {
            const email = 'diego@example.com';
            const user = { id: 1, name: 'Diego', email, password: 'hashedPassword' };

            jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(userDto);
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as never);

            await expect(authService.login(email, 'wrongPassword')).rejects.toThrow(BadRequestException);
        });
    });
});
