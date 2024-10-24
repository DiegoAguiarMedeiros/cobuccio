import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {

    @IsNotEmpty({ message: 'email não pode estar vazio.' })
    @IsString({ message: 'email deve ser uma string' })
    @IsEmail({}, { message: 'email deve ser válido.' })
    email: string;

    @IsNotEmpty({ message: 'password não pode estar vazio.' })
    @IsString({ message: 'A senha deve ser uma string' })
    @IsNotEmpty({ message: 'A senha não pode estar vazia.' })
    password: string;
}
