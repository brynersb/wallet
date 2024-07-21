import { TransactionRequestUseCase } from './transaction-request-use-case';
import { LoggerServiceInterface } from '../../../../common/services/logger/logger.service.interface';
import { TransactionRepositoryInterface } from '../../../repositories/transaction.repository.interface';
import { AccountRepositoryInterface } from '../../../repositories/account.repository.interface';
import { SQSProducerServiceInterface } from '../../../../../shared/src/common/services/sqs/sqs-producer/sqs-producer.service.interface';
import { TransactionEntityDomain } from '../../../entities/transaction-entity-domain';
import { BusinessError } from '../../../../common/types/business-error';
import { TransactionType } from '../../../enums/transaction-type.enum';
import { AccountEntityDomain } from '../../../entities/account-entity-domain';
import { TransactionOperationRequest } from '../../../types/transaction-operation-type';
import TransactionErrorKey from '../../../utils/transaction-error-key';

describe('TransactionRequestUseCase', () => {
  let transactionRequestUseCase: TransactionRequestUseCase;
  let loggerService: LoggerServiceInterface;
  let transactionRepository: TransactionRepositoryInterface;
  let accountRepository: AccountRepositoryInterface;
  let sqsProducer: SQSProducerServiceInterface;

  beforeEach(() => {
    loggerService = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    transactionRepository = {
      findById: jest.fn(),
      create: jest.fn(),
    };

    accountRepository = {
      findById: jest.fn(),
      create: jest.fn(),
    };

    sqsProducer = {
      sendMessage: jest.fn(),
    };

    transactionRequestUseCase = new TransactionRequestUseCase(
      loggerService,
      transactionRepository,
      accountRepository,
      sqsProducer,
    );
  });

  it('should be defined', () => {
    expect(transactionRequestUseCase).toBeDefined();
  });

  it('should create a transaction and send a message if account is found', async () => {
    const request: TransactionOperationRequest = {
      accountId: '1',
      type: TransactionType.DEPOSIT,
      amount: 100,
      customerId: '1',
    };

    const accountEntity = new AccountEntityDomain({
      balance: 1000,
      transactions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    (accountRepository.findById as jest.Mock).mockResolvedValue(accountEntity);
    (transactionRepository.create as jest.Mock).mockResolvedValue(undefined);
    (sqsProducer.sendMessage as jest.Mock).mockResolvedValue(undefined);

    const result = await transactionRequestUseCase.execute(request);

    expect(loggerService.log).toHaveBeenCalledWith(`Start process transaction for accountId:${request.accountId}`);
    expect(accountRepository.findById).toHaveBeenCalledWith(request.accountId);
    expect(transactionRepository.create).toHaveBeenCalled();
    expect(sqsProducer.sendMessage).toHaveBeenCalled();
    expect(result).toBeInstanceOf(TransactionEntityDomain);
  });

  it('should return a BusinessError if account is not found', async () => {
    const request: TransactionOperationRequest = {
      accountId: '1',
      type: TransactionType.DEPOSIT,
      amount: 100,
      customerId: '1',
    };

    (accountRepository.findById as jest.Mock).mockResolvedValue(null);

    const result = await transactionRequestUseCase.execute(request);

    expect(loggerService.log).toHaveBeenCalledWith(`Start process transaction for accountId:${request.accountId}`);
    expect(accountRepository.findById).toHaveBeenCalledWith(request.accountId);
    expect(loggerService.error).toHaveBeenCalledWith(`Account not found, accountId:${request.accountId}`);
    expect(result).toEqual(
      new BusinessError(TransactionErrorKey.accountNotFound, `Account not found, accountId:${request.accountId}`),
    );
  });

  it('should return a BusinessError if an exception is thrown', async () => {
    const request: TransactionOperationRequest = {
      accountId: '1',
      type: TransactionType.DEPOSIT,
      amount: 100,
      customerId: '1',
    };

    const errorMessage = 'Test error';
    (accountRepository.findById as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const result = await transactionRequestUseCase.execute(request);

    expect(loggerService.log).toHaveBeenCalledWith(`Start process transaction for accountId:${request.accountId}`);
    expect(accountRepository.findById).toHaveBeenCalledWith(request.accountId);
    expect(loggerService.error).toHaveBeenCalledWith(
      `An error has occurred while requesting transaction, error:${errorMessage}`,
    );
    expect(result).toEqual(
      new BusinessError(
        TransactionErrorKey.requestTrasactionGeneralError,
        `An error has occurred while requesting transaction, error:${errorMessage}`,
      ),
    );
  });
});
