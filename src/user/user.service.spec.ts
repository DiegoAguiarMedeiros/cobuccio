import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Wallet } from '../wallet/wallet.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

const reqMock: any = {
    user: {
        username: "diego",
        id: 1,
        wallet: {
            id: 1,
            balance: 100
        },
    }
};

const userMock: any = {
    name: 'diego',
    email: 'diego@example.com',
    password: 'password123',
    id: 1,
    wallet: new Wallet
}
const userMockWithBalance: any = {
    name: 'diego',
    email: 'diego@example.com',
    password: 'password123',
    id: 1,
    wallet: {
        id: 1,
        balance: 100
    }
}

describe('UserService', () => {
    let userService: UserService;
    let userRepository: Repository<User>;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        create: jest.fn(),
                        findOne: jest.fn(),
                        findOneBy: jest.fn(),
                        save: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    describe('findOne', () => {
        it('should successfully find a user', async () => {

            jest.spyOn(userRepository, 'findOne').mockReturnValueOnce(userMock);

            const result = await userService.findOne(reqMock);
            expect(result).toEqual(userMock);
        });

        it('should throw BadRequestException if user was not found', async () => {


            jest.spyOn(userRepository, 'findOne').mockReturnValueOnce(null);


            await expect(userService.findOne(reqMock)).rejects.toThrow('Usuário não encontrado');


        });
    });
    describe('findByEmail', () => {
        it('should successfully find a user', async () => {

            jest.spyOn(userRepository, 'findOneBy').mockReturnValueOnce(userMock);

            const result = await userService.findByEmail(userMock.email);
            expect(result).toEqual(userMock);
        });

        it('should throw BadRequestException if user was not found', async () => {


            jest.spyOn(userRepository, 'findOneBy').mockReturnValueOnce(null);

            await expect(userService.findByEmail(userMock.email)).rejects.toThrow('Usuário não encontrado');


        });

    });
    describe('create', () => {
        it('should successfully create a user', async () => {

            const createUserDto: CreateUserDto = {
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password123',
            }


            jest.spyOn(userRepository, 'create').mockReturnValueOnce(userMock);
            jest.spyOn(userRepository, 'save').mockResolvedValueOnce(userMock);

            const result = await userService.create(createUserDto);
            expect(result).toEqual(userMock);
        });
    });

    describe('remove', () => {
        it('should successfully remove user', async () => {

            jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(userMock);

            const result = await userService.remove(reqMock);

            expect(result).toEqual(undefined);
        });
        it('should throw NotFoundException if user was not found', async () => {

            jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

            await expect(userService.remove(reqMock)).rejects.toThrow('Usuário não encontrado');
        });
        it('should throw BadRequestException if user balance is bigger than 0', async () => {

            jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(userMockWithBalance);

            await expect(userService.remove(reqMock)).rejects.toThrow('Usuário possui dinheiro na carteira, faça retirada antes de deletar a conta');
        });
    });
});
