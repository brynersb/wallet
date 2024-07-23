import { GetAccountSummaryUseCase } from './get-account-summary-use-case';
import { LoggerServiceInterface } from '../../../../common/services/logger/logger.service.interface';
import { AccountRepositoryInterface } from '../../../repositories/account.repository.interface';
import { TransactionRepositoryInterface } from '../../../repositories/transaction.repository.interface';
import { AccountEntityDomain } from '../../../entities/account-entity-domain';
import { TransactionResponse } from '../../../types/account.type';
import { BusinessError } from '../../../../common/types/business-error';
import TransactionErrorKey from '../../../utils/transaction-error-key';
import { TransactionType } from '../../../enums/transaction-type.enum';

describe('GetAccountSummaryUseCase', () => {
  let getAccountSummaryUseCase: GetAccountSummaryUseCase;
  let loggerService: LoggerServiceInterface;
  let accountRepository: AccountRepositoryInterface;
  let transactionRepository: TransactionRepositoryInterface;

  beforeEach(() => {
    loggerService = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    accountRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    transactionRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
    };

    getAccountSummaryUseCase = new GetAccountSummaryUseCase(loggerService, accountRepository, transactionRepository);
  });

  it('should return the account summary successfully', async () => {
    const accountId = 'account-id-123';
    const startDate = '2023-01-01';
    const endDate = '2023-12-31';
    const account = new AccountEntityDomain({
      customer: null,
      balance: 100,
      transactions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const transactions: TransactionResponse[] = [
      {
        id: 'transaction-id-1',
        accountId: accountId,
        type: TransactionType.DEPOSIT,
        amount: 100,
        status: 'PROCESSED',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    (accountRepository.findById as jest.Mock).mockResolvedValueOnce(account);
    (transactionRepository.findAll as jest.Mock).mockResolvedValueOnce(transactions);

    const result = await getAccountSummaryUseCase.execute(accountId, startDate, endDate);

    expect(accountRepository.findById).toHaveBeenCalledWith(accountId);
    expect(transactionRepository.findAll).toHaveBeenCalledWith(accountId, { startDate, endDate });
    expect(loggerService.log).toHaveBeenCalledWith(`Start get balance account accountId:${accountId}`);
    expect(result).toEqual({
      balance: account.balance,
      transactions,
    });
  });

  it('should return a BusinessError if the summary is not found', async () => {
    const accountId = 'account-id-123';
    const startDate = '2023-01-01';
    const endDate = '2023-12-31';
    const account = new AccountEntityDomain({
      customer: null,
      balance: 100,
      transactions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    (accountRepository.findById as jest.Mock).mockResolvedValueOnce(account);
    (transactionRepository.findAll as jest.Mock).mockResolvedValueOnce(null);

    const result = await getAccountSummaryUseCase.execute(accountId, startDate, endDate);

    expect(accountRepository.findById).toHaveBeenCalledWith(accountId);
    expect(loggerService.log).toHaveBeenCalledWith(`Start get balance account accountId:${accountId}`);
    expect(loggerService.error).toHaveBeenCalledWith(`Account summary not found, accountId:${accountId}`);

    expect(result).toEqual(
      new BusinessError(TransactionErrorKey.accountNotFound, `Account summary not found, accountId:${accountId}`),
    );
  });

  it('should return a BusinessError if the account is not found', async () => {
    const accountId = 'account-id-123';
    const startDate = '2023-01-01';
    const endDate = '2023-12-31';

    (accountRepository.findById as jest.Mock).mockResolvedValueOnce(null);

    const result = await getAccountSummaryUseCase.execute(accountId, startDate, endDate);

    expect(accountRepository.findById).toHaveBeenCalledWith(accountId);
    expect(loggerService.log).toHaveBeenCalledWith(`Start get balance account accountId:${accountId}`);
    expect(loggerService.error).toHaveBeenCalledWith(
      `An error has occurred while requesting account summary, error:Account not found`,
    );

    expect(result).toEqual(
      new BusinessError(
        TransactionErrorKey.accountGeneralError,
        `An error has occurred while requesting account summary, error:Account not found`,
      ),
    );
  });

  it('should return a BusinessError if an error occurs while requesting the account summary', async () => {
    const accountId = 'account-id-123';
    const startDate = '2023-01-01';
    const endDate = '2023-12-31';
    const errorMessage = 'Test error';

    (accountRepository.findById as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const result = await getAccountSummaryUseCase.execute(accountId, startDate, endDate);

    expect(accountRepository.findById).toHaveBeenCalledWith(accountId);
    expect(loggerService.log).toHaveBeenCalledWith(`Start get balance account accountId:${accountId}`);
    expect(loggerService.error).toHaveBeenCalledWith(
      `An error has occurred while requesting account summary, error:${errorMessage}`,
    );
    expect(result).toEqual(
      new BusinessError(
        TransactionErrorKey.accountGeneralError,
        `An error has occurred while requesting account summary, error:${errorMessage}`,
      ),
    );
  });
});
