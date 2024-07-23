import { LoggerServiceInterface } from '../../../../common/services/logger/logger.service.interface';
import { BusinessError } from '../../../../common/types/business-error';
import { AccountRepositoryInterface } from '../../../repositories/account.repository.interface';
import { AccountBalnce } from '../../../types/account.type';
import TransactionErrorKey from '../../../utils/transaction-error-key';
import { GetAccountBalancedUseCaseInterface } from './get-account-balance-use-case.interface';

export class GetAccountBalancedUseCase implements GetAccountBalancedUseCaseInterface {
  private errorMessage: string;
  constructor(
    private readonly loggerService: LoggerServiceInterface,
    protected readonly accountRepository: AccountRepositoryInterface,
  ) {}
  async execute(accountId: string): Promise<AccountBalnce | BusinessError> {
    try {
      this.loggerService.log(`Start get balance account accountId:${accountId}`);
      const accountFinded = await this.accountRepository.findById(accountId);
      if (accountFinded) {
        return { balance: accountFinded.balance };
      }
      this.errorMessage = `Account not found, accountId:${accountId}`;
      this.loggerService.error(this.errorMessage);
      return new BusinessError(TransactionErrorKey.accountNotFound, this.errorMessage);
    } catch (error) {
      this.errorMessage = `An error has occurred while requesting account balance, error:${error.message}`;
      this.loggerService.error(this.errorMessage);
      return new BusinessError(TransactionErrorKey.accountGeneralError, this.errorMessage);
    }
  }
}
