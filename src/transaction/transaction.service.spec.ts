import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { Wallet } from '../wallet/wallet.entity';
import { User } from '../user/user.entity';
import { Repository, DataSource } from 'typeorm';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let transactionRepository: Repository<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useClass: Repository, // Mock repository class for Transaction
        },
        {
          provide: getRepositoryToken(Wallet),
          useClass: Repository, // Mock repository class for Wallet
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository, // Mock repository class for User
        },
        {
          provide: DataSource,
          useValue: {
            // Mocking only the parts of DataSource that your service uses
            createQueryRunner: jest.fn().mockReturnValue({
              manager: {
                save: jest.fn(),
              },
              connect: jest.fn(),
              release: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
    transactionRepository = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
  });

  it('should be defined', () => {
    expect(transactionService).toBeDefined();
  });
});
