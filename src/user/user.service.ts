import { BadRequestException, Injectable, NotFoundException, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { Wallet } from '../wallet/wallet.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async findOne(@Request() req): Promise<User> {
        const user = req.user;
        const userFound = await this.userRepository.findOne({
            where: { id: user.id },
            relations: ['wallet'],
        });

        if (!userFound) {
            throw new NotFoundException('Usuário não encontrado');
        }
        delete userFound.password
        return userFound;
    }


    async findByEmail(email: string): Promise<User> {
        const userFound = this.userRepository.findOneBy({ email });
        if (!userFound) {
            throw new NotFoundException('Usuário não encontrado');
        }
        return userFound;
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = this.userRepository.create(createUserDto);
        return await this.userRepository.save(user);
    }

    async remove(@Request() req): Promise<void> {
        const user = req.user;
        const userFound = await this.userRepository.findOne({
            where: { id: user.id },
            relations: ['wallet'],  // Faz o join com a tabela wallet
        });

        if (!userFound) {
            throw new NotFoundException('Usuário não encontrado');
        }
        if (userFound.wallet.balance > 0) throw new BadRequestException('Usuário possui dinheiro na carteira, faça retirada antes de deletar a conta');
        await this.userRepository.delete(userFound.id);
    }
}
