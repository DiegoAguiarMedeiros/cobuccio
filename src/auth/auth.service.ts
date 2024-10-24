import { BadRequestException, Injectable, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { Wallet } from '../wallet/wallet.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Wallet)
        private walletRepository: Repository<Wallet>,
        private jwtService: JwtService,
    ) { }

    async register(createUserDto: CreateUserDto): Promise<UserResponseDto> {
        const { password, name, email } = createUserDto

        const user = await this.userRepository.findOneBy({ email });
        if (user) throw new BadRequestException('Email já cadastrado');

        const hashedPassword = await bcrypt.hash(password, 10);
        const wallet = await this.walletRepository.create({ balance: 0.0 });
        const walletSaved = await this.walletRepository.save(wallet);
        const newUser = await this.userRepository.create({ name, email, password: hashedPassword, wallet: walletSaved });
        const userSaved = await this.userRepository.save(newUser);
        userSaved.wallet = walletSaved;
        return {
            status: 201,
            description: 'Usuário criado com sucesso',
            user: {
                id: newUser.id,
                name: userSaved.name,
                email: userSaved.email,
                wallet: userSaved.wallet.id
            },
        };

    }

    async login(email: string, password: string): Promise<{ accessToken: string }> {
        const user = await this.userRepository.findOneBy({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new BadRequestException('Credenciais inválidas');
        }

        const payload = { username: user.name, id: user.id, wallet: user.wallet, sub: user.id };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }

}
