import { IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateWalletDto {
    @IsNotEmpty({ message: 'userId não pode estar vazio.' })
    @IsNumber({}, { message: 'userId deve ser um número.' })
    userId: number;
}
