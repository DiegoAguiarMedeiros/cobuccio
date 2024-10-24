import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
    it('should validate valid CreateUserDto', async () => {
        const dto = new CreateUserDto();
        dto.name = 'John Doe';
        dto.email = 'john.doe@example.com';
        dto.password = 'password123';

        const errors = await validate(dto);
        expect(errors.length).toBe(0); // Deve ser 0 se o DTO for válido
    });

    it('should fail validation if name is empty', async () => {
        const dto = new CreateUserDto();
        dto.name = ''; // nome vazio
        dto.email = 'john.doe@example.com';
        dto.password = 'password123';

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0); // Deve ter erros
        expect(errors[0].constraints.isNotEmpty).toBe('name não pode estar vazio.'); // Verifica mensagem de erro
    });

    it('should fail validation if email is invalid', async () => {
        const dto = new CreateUserDto();
        dto.name = 'John Doe';
        dto.email = 'invalid-email'; // email inválido
        dto.password = 'password123';

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0); // Deve ter erros
        expect(errors[0].constraints.isEmail).toBe('email deve ser válido.'); // Verifica mensagem de erro
    });

    it('should fail validation if password is too short', async () => {
        const dto = new CreateUserDto();
        dto.name = 'John Doe';
        dto.email = 'john.doe@example.com';
        dto.password = 'short'; // senha curta

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0); // Deve ter erros
        expect(errors[0].constraints.minLength).toBe('password deve ter pelo menos 6 caracteres.');
    });
});
