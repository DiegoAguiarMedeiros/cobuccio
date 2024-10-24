import { validate } from 'class-validator';
import { CreateWalletDto } from './create-wallet.dto';

describe('CreateWalletDto', () => {
    it('should validate valid CreateWalletDto', async () => {
        const dto = new CreateWalletDto();
        dto.userId = 1;

        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('should fail validation if userId is null', async () => {
        const dto = new CreateWalletDto();
        dto.userId = null;

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints.isNotEmpty).toBe('userId não pode estar vazio.');
    });
    it('should fail validation if userId is null', async () => {
        const dto = new CreateWalletDto() as any;
        delete dto.userId;

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints.isNotEmpty).toBe('userId não pode estar vazio.');
    });
    it('should fail validation if userId is not a number', async () => {
        const dto = new CreateWalletDto() as any;
        dto.userId = '1';

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints.isNumber).toBe('userId deve ser um número.');
    });


});
