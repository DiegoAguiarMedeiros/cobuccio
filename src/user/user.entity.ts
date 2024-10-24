import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Wallet } from '../wallet/wallet.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @OneToOne(() => Wallet, wallet => wallet.user, { eager: true, cascade: true })
    @JoinColumn()
    wallet: Wallet;

}
