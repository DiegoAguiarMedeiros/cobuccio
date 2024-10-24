import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtConstants.secret,
        });
    }

    async validate(payload: any) {
        try {
            if (!payload.id || !payload.username || !payload.wallet) {
                throw new Error('payload invalid')
            }
            return { id: payload.id, username: payload.username, wallet: payload.wallet };
        } catch (error) {
            throw new Error(`Failed to load data from payload: ${error.message}`);
        }
    }
}
