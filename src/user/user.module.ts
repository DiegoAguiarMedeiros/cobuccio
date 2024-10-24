import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Wallet } from '../wallet/wallet.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Wallet])
    ],
    providers: [UserService],
    controllers: [UserController],
    exports: [TypeOrmModule],
})
export class UserModule { }
