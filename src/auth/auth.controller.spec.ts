import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth.module'; // Importa o módulo de autenticação
import { User } from '../user/user.entity'; // Importa a entidade de usuário (ajuste conforme necessário)
import { CreateUserDto } from './dto/create-user.dto';
import * as request from 'supertest';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from '../user/user.service';

const walletDto: any = {
    id: 1, balance: 0,
    user: new User,
};


const createUserDto: CreateUserDto = {
    name: 'test', email: `test_${Date.now()}@example.com`, password: 'password',
};
const createUserIncorrectEmailDto: CreateUserDto = {
    name: 'test', email: 'test', password: 'password',
};
const createUserWithoutEmailDto: any = {
    name: 'test', password: 'password',
};
const createUserWithoutPasswordLessThanSixDto: any = {
    name: 'test', email: `test@example.com`, password: 'pass'
};
const createUserWithoutPasswordDto: any = {
    name: 'test', email: `test@example.com`
};

const createUserWithInvalidNameDto: CreateUserDto = {
    name: '',
    email: 'new.email@example.com',
    password: 'strongpassword',
};
const createUserWithoutNameDto: any = {
    email: 'new.email@example.com',
    password: 'strongpassword',
};

const userDto: User = {
    id: 1, name: 'test', email: `test_${Date.now()}@example.com`, password: 'password',
    wallet: walletDto
};

const userResponseDto: UserResponseDto = {
    status: 201,
    description: 'Usuário criado com sucesso',
    user: {
        id: userDto.id,
        name: userDto.name,
        email: userDto.email,
        wallet: userDto.wallet.id,
    },
}
describe('AuthController (integration)', () => {
    let app: INestApplication;
    let userService: UserService;


    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: 'localhost', // ou o host que você está usando
                    port: 5432, // porta padrão do PostgreSQL
                    username: 'postgres',
                    password: 'postgres',
                    database: 'cobuccio_wallet',
                    entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Adjust based on your project structure
                    synchronize: true,
                }),
                AuthModule, // Import your Auth module here
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }));
        await app.init();
        userService = moduleFixture.get<UserService>(UserService); // Injete o UserService

    });

    afterAll(async () => {
        await app.close();
    });

    it('should register a user successfully', async () => {

        const response = await request(app.getHttpServer())
            .post('/auth/register') // Rota de registro
            .send(createUserDto)
            .expect(201); // Espera o status 201 (Created)

        const createdUser = await userService.findByEmail(createUserDto.email)
        const userResponseDtoWithId = {
            status: 201,
            description: 'Usuário criado com sucesso',
            user: {
                ...userResponseDto.user,
                id: createdUser.id,
                wallet: createdUser.wallet.id
            }
        }
        expect(response.body).toStrictEqual(userResponseDtoWithId); // Verifica se o email está correto
    });

    it('should fail to register a user with an already used email', async () => {

        const response = await request(app.getHttpServer())
            .post('/auth/register')
            .send(createUserDto)
            .expect(400); // Espera o status 400 (Bad Request)

        expect(response.body.message).toContain('Email já cadastrado'); // Verifica a mensagem de erro
    });

    it('should fail to register a user with empty name', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/register')
            .send(createUserWithInvalidNameDto)
            .expect(400); // Espera o status 400 (Bad Request)

        expect(response.body.message).toContain('name não pode estar vazio.'); // Verifica mensagem de erro
    });
    it('should fail to register a user with without name', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/register')
            .send(createUserWithoutNameDto)
            .expect(400); // Espera o status 400 (Bad Request)

        expect(response.body.message).toContain('name não pode estar vazio.'); // Verifica mensagem de erro
    });

    it('should fail to register a user with invalid email', async () => {

        const response = await request(app.getHttpServer())
            .post('/auth/register')
            .send(createUserIncorrectEmailDto)
            .expect(400); // Espera o status 400 (Bad Request)

        expect(response.body.message).toStrictEqual(["email deve ser válido."]); // Verifica mensagem de erro
    });
    it('should fail to register a user without email', async () => {


        const response = await request(app.getHttpServer())
            .post('/auth/register')
            .send(createUserWithoutEmailDto)
            .expect(400); // Espera o status 400 (Bad Request)

        expect(response.body.message).toStrictEqual(["email não pode estar vazio.", "email deve ser válido."]); // Verifica mensagem de erro
    });
    it('should fail to register a user without password', async () => {


        const response = await request(app.getHttpServer())
            .post('/auth/register')
            .send(createUserWithoutPasswordDto)
            .expect(400); // Espera o status 400 (Bad Request)

        expect(response.body.message).toStrictEqual(["password deve ter pelo menos 6 caracteres.", "password não pode estar vazia.", "password deve ser uma string"]); // Verifica mensagem de erro
    });

    it('should fail to register a user with short password', async () => {

        const response = await request(app.getHttpServer())
            .post('/auth/register')
            .send(createUserWithoutPasswordLessThanSixDto)
            .expect(400); // Espera o status 400 (Bad Request)

        expect(response.body.message).toContain('password deve ter pelo menos 6 caracteres.'); // Verifica mensagem de erro
    });
});
