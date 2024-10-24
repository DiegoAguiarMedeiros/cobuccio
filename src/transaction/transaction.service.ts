import { BadRequestException, Injectable, NotFoundException, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Transaction, TransactionStatus } from './transaction.entity';
import { Wallet } from '../wallet/wallet.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateDepositWithdrawalTransactionDto } from './dto/create-deposit-withdrawal-transaction.dto';
import { CreateWithdrawalTransactionDto } from './dto/create-withdrawal-transaction.dto';
import { User } from '../user/user.entity';

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
        @InjectRepository(Wallet)
        private walletRepository: Repository<Wallet>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private dataSource: DataSource
    ) { }

    async createTransaction(@Request() req, createTransactionDto: CreateTransactionDto): Promise<Transaction> {
        const { toWalletId, amount, description } = createTransactionDto;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = req.user;
            const userFound = await this.userRepository.findOneBy({ id: user.id });
            const fromWallet = await this.walletRepository.findOneBy({ id: userFound.wallet.id });
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const toWallet = await this.walletRepository.findOneBy({ id: toWalletId });


            if (!fromWallet) {
                throw new NotFoundException('Carteira de origem não encontrada');
            }
            if (!toWallet) {
                throw new NotFoundException('Carteira de destino não encontrada');
            }

            if (userFound.wallet.id === toWalletId) {
                throw new BadRequestException('Carteira de origem e destino não podem ser a mesma');
            }

            if (fromWallet.balance < amount) {
                throw new BadRequestException('Saldo insuficiente na carteira de origem');
            }

            fromWallet.balance -= amount;
            toWallet.balance += amount;

            await queryRunner.manager.save(Wallet, fromWallet);
            await queryRunner.manager.save(Wallet, toWallet);

            const transaction = this.transactionRepository.create({
                fromWallet: fromWallet,
                toWallet,
                amount,
                description: description || null,
                status: TransactionStatus.COMPLETED,
            });

            const savedTransaction = await queryRunner.manager.save(transaction);

            await queryRunner.commitTransaction();

            return savedTransaction;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async reverseTransaction(@Request() req, transactionId: number) {



        const user = req.user;
        const userFound = await this.userRepository.findOneBy({ id: user.id });
        const wallet = await this.walletRepository.findOneBy({ id: userFound.wallet.id });


        const transaction = await this.transactionRepository.findOne({
            where: { id: transactionId, status: TransactionStatus.COMPLETED },
            relations: ['fromWallet', 'toWallet'],
        });

        if (!transaction) {
            throw new NotFoundException('Transação não encontrada');
        }
        if (transaction.toWallet.id !== wallet.id) {
            throw new BadRequestException('Impossível reverter essa transação');
        }
        if (transaction.status === TransactionStatus.REVERSED) {
            throw new BadRequestException('Essa transação já foi estornada');
        }

        const { fromWallet, toWallet, amount } = transaction;

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            if (toWallet.balance < amount) {
                throw new BadRequestException('Saldo insuficiente na carteira de origem');
            }

            const toWalletBalance = Number(toWallet.balance);
            const fromWalletBalance = Number(fromWallet.balance);

            toWallet.balance = toWalletBalance - amount;
            fromWallet.balance = fromWalletBalance + amount;

            await queryRunner.manager.save(toWallet);
            await queryRunner.manager.save(fromWallet);

            transaction.status = TransactionStatus.REVERSED;
            await queryRunner.manager.save(transaction);

            await queryRunner.commitTransaction();
            return { message: 'Transação estornada com sucesso' };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async getTransactionsByWallet(@Request() req): Promise<Transaction[]> {
        const user = req.user;
        const userFound = await this.userRepository.findOneBy({ id: user.id });
        const wallet = await this.walletRepository.findOneBy({ id: userFound.wallet.id });
        if (!wallet) {
            throw new NotFoundException('Carteira não encontrada');
        }
        return this.transactionRepository.find({
            where: [{ fromWallet: { id: wallet.id } }, { toWallet: { id: wallet.id } }],
            relations: ['fromWallet', 'toWallet'],
        });
    }

    async createDeposit(@Request() req, createDepositWithdrawalTransactionDto: CreateDepositWithdrawalTransactionDto): Promise<Transaction> {
        const { amount } = createDepositWithdrawalTransactionDto;
        const user = req.user;
        const userFound = await this.userRepository.findOneBy({ id: user.id });
        const toWallet = await this.walletRepository.findOneBy({ id: userFound.wallet.id });

        if (!toWallet) {
            throw new NotFoundException('Carteira não encontrada');
        }

        toWallet.balance += amount;
        await this.walletRepository.save(toWallet);

        const transaction = this.transactionRepository.create({
            fromWallet: null,
            toWallet,
            amount,
            description: 'Depósito',
            status: TransactionStatus.COMPLETED,
        });

        return this.transactionRepository.save(transaction);
    }

    async createWithdrawal(@Request() req, createDepositWithdrawalTransactionDto: CreateDepositWithdrawalTransactionDto): Promise<Transaction> {
        const { amount } = createDepositWithdrawalTransactionDto;
        const user = req.user;
        const userFound = await this.userRepository.findOneBy({ id: user.id });
        const fromWallet = await this.walletRepository.findOneBy({ id: userFound.wallet.id });

        if (!fromWallet) {
            throw new NotFoundException('Carteira não encontrada');
        }

        fromWallet.balance -= amount;
        await this.walletRepository.save(fromWallet);

        const transaction = this.transactionRepository.create({
            toWallet: null,
            fromWallet,
            amount,
            description: 'Retirada',
            status: TransactionStatus.COMPLETED,
        });

        return this.transactionRepository.save(transaction);
    }
}
