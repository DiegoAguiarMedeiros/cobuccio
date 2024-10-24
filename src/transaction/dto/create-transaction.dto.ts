import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty({ message: 'toWalletId é obrigatório' })
  @IsNumber({}, { message: 'toWalletId deve ser um número' })
  toWalletId: number;

  @IsNotEmpty({ message: 'amount é obrigatório' })
  @IsNumber({}, { message: 'amount deve ser um número' })
  @IsPositive({ message: 'amount deve ser um valor positivo' })
  amount: number;

  @IsString({ message: 'description deve ser uma string' })
  description: string;
}
