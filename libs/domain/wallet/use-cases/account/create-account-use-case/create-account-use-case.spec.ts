import { CreateAccountUseCase } from './create-account-use-case';
import { LoggerServiceInterface } from '../../../../common/services/logger/logger.service.interface';
import { AccountRepositoryInterface } from '../../../repositories/account.repository.interface';
import { CustomerRepositoryInterface } from '../../../repositories/customer.repository.interface';
import { CustomerEntityDomain } from '../../../entities/customer-entity-domain';
import { AccountEntityDomain } from '../../../entities/account-entity-domain';
import { BusinessError } from '../../../../common/types/business-error';
import TransactionErrorKey from '../../../utils/transaction-error-key';

describe('CreateAccountUseCase', () => {
  let createAccountUseCase: CreateAccountUseCase;
  let loggerService: LoggerServiceInterface;
  let accountRepository: AccountRepositoryInterface;
  let customerRepository: CustomerRepositoryInterface;

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

    customerRepository = {
      create: jest.fn(),
    };

    createAccountUseCase = new CreateAccountUseCase(loggerService, accountRepository, customerRepository);
  });

  it('should create an account successfully', async () => {
    const name = 'John Doe';
    const email = 'john@example.com';

    (customerRepository.create as jest.Mock).mockResolvedValueOnce(undefined);
    (accountRepository.create as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await createAccountUseCase.execute(name, email);

    expect(customerRepository.create).toHaveBeenCalledWith(expect.any(CustomerEntityDomain));
    expect(accountRepository.create).toHaveBeenCalledWith(expect.any(AccountEntityDomain));
    expect(loggerService.log).toHaveBeenCalledWith(`start create account with params name:${name} email:${email}`);

    expect(result).toEqual({
      accountId: expect.any(String),
      name,
      email,
    });
  });

  it('should return a BusinessError if an error occurs while creating the account', async () => {
    const name = 'John Doe';
    const email = 'john@example.com';
    const errorMessage = 'Test error';

    (customerRepository.create as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const result = await createAccountUseCase.execute(name, email);

    expect(customerRepository.create).toHaveBeenCalledWith(expect.any(CustomerEntityDomain));
    expect(accountRepository.create).not.toHaveBeenCalled();
    expect(loggerService.error).toHaveBeenCalledWith(
      `An error has occurred while create account, error:${errorMessage}`,
    );

    expect(result).toEqual(
      new BusinessError(
        TransactionErrorKey.accountGeneralError,
        `An error has occurred while create account, error:${errorMessage}`,
      ),
    );
  });
});
