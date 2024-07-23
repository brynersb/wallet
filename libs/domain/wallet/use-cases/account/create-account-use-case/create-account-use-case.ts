import { LoggerServiceInterface } from '../../../../common/services/logger/logger.service.interface';
import { BusinessError } from '../../../../common/types/business-error';
import { AccountEntityDomain } from '../../../entities/account-entity-domain';
import { CustomerEntityDomain } from '../../../entities/customer-entity-domain';
import { AccountRepositoryInterface } from '../../../repositories/account.repository.interface';
import { CustomerRepositoryInterface } from '../../../repositories/customer.repository.interface';
import { AccountCreatedResponse } from '../../../types/account.type';
import TransactionErrorKey from '../../../utils/transaction-error-key';
import { CreateAccountUseCaseInterface } from './create-account-use-case.interface';

export class CreateAccountUseCase implements CreateAccountUseCaseInterface {
  private errorMessage: string;
  constructor(
    private readonly loggerService: LoggerServiceInterface,
    protected readonly accountRepository: AccountRepositoryInterface,
    protected readonly customerRepository: CustomerRepositoryInterface,
  ) {}
  async execute(name: string, email: string): Promise<AccountCreatedResponse | BusinessError> {
    try {
      this.loggerService.log(`start create account with params name:${name} email:${email}`);
      const customer = new CustomerEntityDomain({
        name: name,
        email: email,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await this.customerRepository.create(customer);

      const account = new AccountEntityDomain({
        customer: customer,
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await this.accountRepository.create(account);
      this.loggerService.log(`account create succesfulty accountId:${account.id}`);
      return {
        accountId: account.id,
        name: customer.name,
        email: customer.email,
      };
    } catch (error) {
      this.errorMessage = `An error has occurred while create account, error:${error.message}`;
      this.loggerService.error(this.errorMessage);
      return new BusinessError(TransactionErrorKey.accountGeneralError, this.errorMessage);
    }
  }
}
