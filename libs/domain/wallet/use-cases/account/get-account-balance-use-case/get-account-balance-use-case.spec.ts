import { GetAccountBalancedUseCase } from './get-account-balance-use-case';
import { LoggerServiceInterface } from '../../../../common/services/logger/logger.service.interface';
import { AccountRepositoryInterface } from '../../../repositories/account.repository.interface';
import { AccountEntityDomain } from '../../../entities/account-entity-domain';
import { BusinessError } from '../../../../common/types/business-error';
import TransactionErrorKey from '../../../utils/transaction-error-key';

describe('GetAccountBalancedUseCase', () => {
  let getAccountBalancedUseCase: GetAccountBalancedUseCase;
  let loggerService: LoggerServiceInterface;
  let accountRepository: AccountRepositoryInterface;

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

    getAccountBalancedUseCase = new GetAccountBalancedUseCase(loggerService, accountRepository);
  });

  it('should return the account balance successfully', async () => {
    const accountId = 'account-id-123';
    const account = new AccountEntityDomain({
      customer: null,
      balance: 100,
      transactions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    (accountRepository.findById as jest.Mock).mockResolvedValueOnce(account);

    const result = await getAccountBalancedUseCase.execute(accountId);

    expect(accountRepository.findById).toHaveBeenCalledWith(accountId);
    expect(loggerService.log).toHaveBeenCalledWith(`Start get balance account accountId:${accountId}`);
    expect(result).toEqual({ balance: 100 });
  });

  it('should return a BusinessError if the account is not found', async () => {
    const accountId = 'account-id-123';

    (accountRepository.findById as jest.Mock).mockResolvedValueOnce(null);

    const result = await getAccountBalancedUseCase.execute(accountId);

    expect(accountRepository.findById).toHaveBeenCalledWith(accountId);
    expect(loggerService.log).toHaveBeenCalledWith(`Start get balance account accountId:${accountId}`);
    expect(loggerService.error).toHaveBeenCalledWith(`Account not found, accountId:${accountId}`);
    expect(result).toEqual(
      new BusinessError(TransactionErrorKey.accountNotFound, `Account not found, accountId:${accountId}`),
    );
  });

  it('should return a BusinessError if an error occurs while requesting the account balance', async () => {
    const accountId = 'account-id-123';
    const errorMessage = 'Test error';

    (accountRepository.findById as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const result = await getAccountBalancedUseCase.execute(accountId);

    expect(accountRepository.findById).toHaveBeenCalledWith(accountId);
    expect(loggerService.log).toHaveBeenCalledWith(`Start get balance account accountId:${accountId}`);
    expect(loggerService.error).toHaveBeenCalledWith(
      `An error has occurred while requesting account balance, error:${errorMessage}`,
    );
    expect(result).toEqual(
      new BusinessError(
        TransactionErrorKey.accountGeneralError,
        `An error has occurred while requesting account balance, error:${errorMessage}`,
      ),
    );
  });
});
