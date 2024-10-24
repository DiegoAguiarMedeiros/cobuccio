import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants/constants';

describe('JwtStrategy', () => {
    let jwtStrategy: JwtStrategy;
    let authService: AuthService;

    beforeEach(() => {
        jwtStrategy = new JwtStrategy(authService);
    });

    describe('validate', () => {
        it('should return a valid user object with wallet', async () => {
            // Mock do payload
            const payload = {
                id: 1,
                username: 'diego',
                wallet: {
                    id: 1,
                    balance: 100,
                },
            };

            // Chama a função validate com o payload mockado
            const result = await jwtStrategy.validate(payload);

            // Verifica se o resultado retorna o objeto esperado
            expect(result).toEqual({
                id: 1,
                username: 'diego',
                wallet: {
                    id: 1,
                    balance: 100,
                },
            });
        });

        it('should throw an error if the payload is invalid', async () => {
            // Payload inválido sem informações necessárias
            const invalidPayload = {
                username: 'diego',
            };

            // Testa se a função 'validate' retorna um erro ao receber um payload inválido
            await expect(jwtStrategy.validate(invalidPayload)).rejects.toThrow();
        });
    });
});
