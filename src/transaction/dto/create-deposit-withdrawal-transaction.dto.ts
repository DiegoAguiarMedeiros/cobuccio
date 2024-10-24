import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDepositWithdrawalTransactionDto {
  @IsNotEmpty({ message: 'amount não pode estar vazio.' })
  @IsNumber({}, { message: 'amount deve ser um número' })
  amount: number;
}
