import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString({ message: 'name deve ser uma string' })
    @IsNotEmpty({ message: 'name não pode estar vazio.' })
    name: string;

    @IsEmail({}, { message: 'email deve ser válido.' })
    @IsNotEmpty({ message: 'email não pode estar vazio.' })
    email: string;

    @IsString({ message: 'password deve ser uma string' })
    @IsNotEmpty({ message: 'password não pode estar vazia.' })
    @MinLength(6, { message: 'password deve ter pelo menos 6 caracteres.' })
    password: string;
}
