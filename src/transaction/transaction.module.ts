import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '../wallet/wallet.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Wallet, User])],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TypeOrmModule],
})
export class TransactionModule { }
