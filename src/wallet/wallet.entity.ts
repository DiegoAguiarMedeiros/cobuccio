import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Transaction } from '../transaction/transaction.entity';

@Entity()
export class Wallet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'decimal', precision: 10, scale: 2, default: 0.00,
        transformer: {
            to(value: number): number {
                return value ? parseFloat(value.toFixed(2)) : 0;
            },
            from: (value: string) => parseFloat(value),
        }
    })
    balance: number;

    @OneToOne(() => User, (user) => user.wallet)
    user: User;

    @OneToMany(() => Transaction, (transaction) => transaction.fromWallet)
    sentTransactions: Transaction[];

    @OneToMany(() => Transaction, (transaction) => transaction.toWallet)
    receivedTransactions: Transaction[];
}
