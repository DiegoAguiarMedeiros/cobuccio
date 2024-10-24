import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';


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
const createWalletMock: any = {
  balance: 0,
};

describe('WalletService', () => {
  let walletService: WalletService;
  let walletRepository: Repository<Wallet>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: getRepositoryToken(Wallet),
          useValue: {
            create: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    walletService = module.get<WalletService>(WalletService);
    walletRepository = module.get<Repository<Wallet>>(getRepositoryToken(Wallet));
  });

  it('should be defined', () => {
    expect(walletService).toBeDefined();
  });

  describe('createWallet', () => {
    it('should successfully create a wallet with initial balance 0', async () => {

      jest.spyOn(walletRepository, 'create').mockReturnValueOnce(createWalletMock);
      jest.spyOn(walletRepository, 'save').mockResolvedValueOnce(createWalletMock);

      const result = await walletService.createWallet();

      expect(result).toEqual(createWalletMock);
      expect(walletRepository.create).toHaveBeenCalledWith({ balance: 0 });
      expect(walletRepository.save).toHaveBeenCalledWith(createWalletMock);
    });

    it('should throw an error if saving wallet fails', async () => {
      jest.spyOn(walletRepository, 'create').mockReturnValueOnce(createWalletMock);
      jest.spyOn(walletRepository, 'save').mockRejectedValueOnce(new Error('Database save error'));

      await expect(walletService.createWallet()).rejects.toThrow('Failed to create wallet: Database save error');

      expect(walletRepository.create).toHaveBeenCalledWith({ balance: 0 });
      expect(walletRepository.save).toHaveBeenCalledWith(createWalletMock);
    });
  });

  describe('getWalletBalance', () => {
    it('should return the balance when the wallet is found', async () => {
      const mockWallet: Wallet = { id: 1, balance: 100 } as Wallet;

      jest.spyOn(walletService, 'getWalletById').mockResolvedValue(mockWallet);

      const result = await walletService.getWalletBalance(reqMock);

      expect(result).toBe(100);
    });

    it('should throw an error when the wallet is not found', async () => {
      jest.spyOn(walletService, 'getWalletById').mockResolvedValue(undefined);

      await expect(walletService.getWalletBalance(reqMock)).rejects.toThrow('Carteira não encontrada');
    });

    it('should throw an error if there is a database error', async () => {
      jest.spyOn(walletService, 'getWalletById').mockRejectedValue(new Error('Database error'));

      await expect(walletService.getWalletBalance(reqMock)).rejects.toThrow('Carteira não encontrada: Database error');
    });
  });


  describe('getWalletById', () => {
    it('should return a wallet when found', async () => {
      const mockWallet: Wallet = { id: 1, balance: 100 } as Wallet;

      jest.spyOn(walletRepository, 'findOneBy').mockResolvedValue(mockWallet);

      const result = await walletService.getWalletById(1);

      expect(result).toEqual(mockWallet);
      expect(walletRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null when the wallet is not found', async () => {
      jest.spyOn(walletRepository, 'findOneBy').mockResolvedValue(null);

      const result = await walletService.getWalletById(1);

      expect(result).toBeNull();
      expect(walletRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw an error if there is a database error', async () => {
      jest.spyOn(walletRepository, 'findOneBy').mockRejectedValue(new Error('Failed to get wallet by id: Database error'));

      await expect(walletService.getWalletById(1)).rejects.toThrow('Failed to get wallet by id: Database error');
      expect(walletRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
