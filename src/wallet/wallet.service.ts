import { Injectable, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';

@Injectable()
export class WalletService {

    constructor(
        @InjectRepository(Wallet)
        private walletRepository: Repository<Wallet>,
    ) { }

    async createWallet(): Promise<Wallet> {
        try {
            const wallet = this.walletRepository.create({
                balance: 0,
            });
            return await this.walletRepository.save(wallet);
        } catch (error) {
            throw new Error(`Failed to create wallet: ${error.message}`);
        }
    }

    async getWalletById(walletId: number): Promise<Wallet> {
        try {
            return this.walletRepository.findOneBy({ id: walletId });
        } catch (error) {
            throw new Error(`Failed to get wallet by id: ${error.message}`);
        }
    }

    async getWalletBalance(@Request() req): Promise<number> {
        try {
            const user = req.user;
            const wallet = await this.getWalletById(user.wallet.id);
            if (!wallet) {
                throw new Error('Carteira não encontrada');
            }
            return wallet.balance;
        } catch (error) {
            throw new Error(`Carteira não encontrada: ${error.message}`);
        }
    }
}
