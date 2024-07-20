import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsApiService } from './transactions-api.service';
import { TransactionRequestUseCaseInterface } from '../../../../libs/domain/wallet/transactions/use-cases/transaction-request-use-case/transaction-request-use-case.interface';
import { GetTransactionStatusUseCaseInterface } from '../../../../libs/domain/wallet/transactions/use-cases/get-transaction-status-use-case/get-transaction-status-case.interface';
import { TransactionOperationRequest } from '../../../../libs/domain/wallet/transactions/types/transaction-operation-type';
import { TransactionEntityDomain } from '../../../../libs/domain/wallet/entities/transaction-entity-domain';
import { BusinessError } from '../../../../libs/domain/common/types/business-error';
import { TransactionType } from '../../../../libs/domain/wallet/enums/transaction-type.enum';
import TransactionErrorKey from '../../../../libs/domain/wallet/utils/transaction-error-key';
import { AccountEntityDomain } from '../../../../libs/domain/wallet/entities/account-entity-domain';

describe('TransactionsApiService', () => {
  let service: TransactionsApiService;
  let transactionRequestUseCase: TransactionRequestUseCaseInterface;
  let getTransactionStatusUseCase: GetTransactionStatusUseCaseInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsApiService,
        {
          provide: 'RequestTransactionUseCaseInterface',
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: 'GetTransactionStatusUseCaseInterface',
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsApiService>(TransactionsApiService);
    transactionRequestUseCase = module.get<TransactionRequestUseCaseInterface>('RequestTransactionUseCaseInterface');
    getTransactionStatusUseCase = module.get<GetTransactionStatusUseCaseInterface>(
      'GetTransactionStatusUseCaseInterface',
    );
  });

  describe('createTransaction', () => {
    it('should return a TransactionEntityDomain when transaction request is successful', async () => {
      const transactionRequestDto: TransactionOperationRequest = {
        accountId: '16153f35-5b0a-4eb6-a4b4-c1ea55816bdc',
        type: TransactionType.ADDITION,
        customerId: '16153f35-5b0a-4eb6-a4b4-c1ea55816bdc',
        amount: 10.5,
      };

      const transactionResponseDto: TransactionEntityDomain = new TransactionEntityDomain({
        account: {} as AccountEntityDomain, //
        type: TransactionType.ADDITION,
        amount: 10.5,
        status: 'PROCESSING',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      (transactionRequestUseCase.execute as jest.Mock).mockResolvedValue(transactionResponseDto);

      const result = await service.createTransaction(transactionRequestDto);

      expect(result).toBe(transactionResponseDto);
      expect(transactionRequestUseCase.execute).toHaveBeenCalledWith(transactionRequestDto);
    });

    it('should return a BusinessError when transaction request fails', async () => {
      const transactionRequestDto: TransactionOperationRequest = {
        accountId: '16153f35-5b0a-4eb6-a4b4-c1ea55816bdc',
        type: TransactionType.ADDITION,
        customerId: '16153f35-5b0a-4eb6-a4b4-c1ea55816bdc',
        amount: 10.5,
      };

      const businessError: BusinessError = {
        errorKey: TransactionErrorKey.requestTrasactionGeneralError,
        errorMessage: 'Internal server error',
      };

      (transactionRequestUseCase.execute as jest.Mock).mockResolvedValue(businessError);

      const result = await service.createTransaction(transactionRequestDto);

      expect(result).toBe(businessError);
      expect(transactionRequestUseCase.execute).toHaveBeenCalledWith(transactionRequestDto);
    });
  });

  describe('getTransaction', () => {
    it('should return a TransactionEntityDomain when transaction is found', async () => {
      const transactionId = 'transaction-id';

      const transactionResponseDto: TransactionEntityDomain = new TransactionEntityDomain({
        account: {} as AccountEntityDomain,
        type: TransactionType.ADDITION,
        amount: 10.5,
        status: 'PROCESSING',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      (getTransactionStatusUseCase.execute as jest.Mock).mockResolvedValue(transactionResponseDto);

      const result = await service.getTransaction(transactionId);

      expect(result).toBe(transactionResponseDto);
      expect(getTransactionStatusUseCase.execute).toHaveBeenCalledWith(transactionId);
    });

    it('should return a BusinessError when transaction is not found', async () => {
      const transactionId = 'transaction-id';

      const businessError: BusinessError = {
        errorKey: TransactionErrorKey.trasactionNotFound,
        errorMessage: 'Transaction not found',
      };

      (getTransactionStatusUseCase.execute as jest.Mock).mockResolvedValue(businessError);

      const result = await service.getTransaction(transactionId);

      expect(result).toBe(businessError);
      expect(getTransactionStatusUseCase.execute).toHaveBeenCalledWith(transactionId);
    });
  });
});
