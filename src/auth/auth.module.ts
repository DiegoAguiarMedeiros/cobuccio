import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { WalletModule } from '../wallet/wallet.module';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/constants';

@Module({
    imports: [
        UserModule,
        WalletModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: jwtConstants.expiresIn },
        }),
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule { }
