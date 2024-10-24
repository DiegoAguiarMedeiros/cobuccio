import { validate } from 'class-validator';
import { LoginDto } from './login.dto';

describe('loginDto', () => {
    it('should validate valid loginDto', async () => {
        const dto = new LoginDto();
        dto.email = 'john.doe@example.com';
        dto.password = 'password123';

        const errors = await validate(dto);
        expect(errors.length).toBe(0); // Deve ser 0 se o DTO for válido
    });

    it('should fail validation if email is invalid', async () => {
        const dto = new LoginDto();
        dto.email = 'invalid-email'; // email inválido
        dto.password = 'password123';

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0); // Deve ter erros
        expect(errors[0].constraints.isEmail).toBe('email deve ser válido.'); // Verifica mensagem de erro
    });
    it('should fail validation if password is empty', async () => {
        const dto = new LoginDto();
        dto.email = ''; // email inválido
        dto.password = 'password123';

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0); // Deve ter erros
        expect(errors[0].constraints.isNotEmpty).toBe('email não pode estar vazio.');
    });

    it('should fail validation if name is empty', async () => {
        const dto = new LoginDto();
        dto.email = 'john.doe@example.com';
        dto.password = ''; // senha curta

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0); // Deve ter erros
        expect(errors[0].constraints.isNotEmpty).toBe('password não pode estar vazio.');
    });
});
