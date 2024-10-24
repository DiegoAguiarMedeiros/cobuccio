import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { AuthModule } from './auth/auth.module';
import { WalletService } from './wallet/wallet.service';
import { WalletController } from './wallet/wallet.controller';
import { TransactionService } from './transaction/transaction.service';
import { TransactionController } from './transaction/transaction.controller';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { Wallet } from './wallet/wallet.entity';
import { Transaction } from './transaction/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Wallet, Transaction],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Wallet, Transaction]),
    AuthModule,
    WalletModule,
    TransactionModule,
  ],
  controllers: [UserController, WalletController, TransactionController],
  providers: [UserService, WalletService, TransactionService],
})
export class AppModule { }
