import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Wallet } from '../wallet/wallet.entity';

export enum TransactionStatus {
    COMPLETED = 'concluido',
    REVERSED = 'estornado',
}

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Wallet, (wallet) => wallet.sentTransactions)
    fromWallet: Wallet | null;

    @ManyToOne(() => Wallet, (wallet) => wallet.receivedTransactions)
    toWallet: Wallet | null;

    @Column({
        type: 'decimal', precision: 10, scale: 2,
        transformer: {
            to: (value: number) => parseFloat(value.toFixed(2)),
            from: (value: string) => parseFloat(value),
        }
    })
    amount: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    description: string | null;;

    @Column({
        type: 'enum',
        enum: TransactionStatus,
        default: TransactionStatus.COMPLETED,
    })
    status: TransactionStatus;
}
