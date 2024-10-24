import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateWithdrawalTransactionDto {
  @IsNotEmpty({ message: 'amount não pode estar vazio.' })
  @IsNumber({}, { message: 'amount deve ser um número' })
  amount: number;

  @IsString({ message: 'description deve ser uma string' })
  description: string;
}
