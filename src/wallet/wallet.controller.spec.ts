import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity'; // Importa a entidade de usuário (ajuste conforme necessário)
import * as request from 'supertest';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { WalletModule } from './wallet.module';
import { Wallet } from './wallet.entity';
import { AuthModule } from '../auth/auth.module';
import * as jwt from 'jsonwebtoken';

const reqMock: any = {
  user: {
    username: "diego",
    id: 1,
    wallet: {
      id: 1,
      balance: 100
    },
  }
};

describe('WalletController (integration)', () => {
  let app: INestApplication;
  let walletService: WalletService;
  let token: string;
  let tokenDecoded: any;

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
        AuthModule,
        WalletModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));
    await app.init();


    walletService = moduleFixture.get<WalletService>(WalletService);
    const response = await request(app.getHttpServer())
      .post('/auth')
      .send({ "email": "test@teste.com", "password": "123456" })
      .expect(201);
    token = response.body.accessToken;

    tokenDecoded = jwt.decode(token);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should get wallet balance successfully', async () => {



    const response = await request(app.getHttpServer())
      .get('/wallets/balance') // Rota de registro
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(200); // Espera o status 201 (Created)

    const createdWallet = await walletService.getWalletBalance({ user: tokenDecoded })
    expect(Number(response.text)).toBe(createdWallet);
  });

});

