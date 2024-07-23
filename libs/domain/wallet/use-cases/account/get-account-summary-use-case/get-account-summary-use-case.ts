import { LoggerServiceInterface } from '../../../../common/services/logger/logger.service.interface';
import { BusinessError } from '../../../../common/types/business-error';
import { AccountRepositoryInterface } from '../../../repositories/account.repository.interface';
import { TransactionRepositoryInterface } from '../../../repositories/transaction.repository.interface';
import { AccountSummary } from '../../../types/account.type';
import TransactionErrorKey from '../../../utils/transaction-error-key';
import { GetAccountSummaryUseCaseInterface } from './get-account-summary-use-case.interface';

export class GetAccountSummaryUseCase implements GetAccountSummaryUseCaseInterface {
  private errorMessage: string;
  constructor(
    private readonly loggerService: LoggerServiceInterface,
    protected readonly accountRepository: AccountRepositoryInterface,
    protected readonly transactionRepository: TransactionRepositoryInterface,
  ) {}
  async execute(accountId: string, startDate: string, endDate: string): Promise<AccountSummary | BusinessError> {
    try {
      this.loggerService.log(`Start get balance account accountId:${accountId}`);
      const accountSummary = await this.getBalanceAndTransactions(accountId, startDate, endDate);
      if (accountSummary?.transactions) {
        return accountSummary;
      }
      this.errorMessage = `Account summary not found, accountId:${accountId}`;
      this.loggerService.error(this.errorMessage);
      return new BusinessError(TransactionErrorKey.accountNotFound, this.errorMessage);
    } catch (error) {
      this.errorMessage = `An error has occurred while requesting account summary, error:${error.message}`;
      this.loggerService.error(this.errorMessage);
      return new BusinessError(TransactionErrorKey.accountGeneralError, this.errorMessage);
    }
  }

  async getBalanceAndTransactions(accountId: string, startDate: string, endDate: string): Promise<AccountSummary> {
    const account = await this.accountRepository.findById(accountId);

    if (!account) {
      throw new Error('Account not found');
    }

    const transactions = await this.transactionRepository.findAll(accountId, { startDate, endDate });

    return {
      balance: account.balance,
      transactions,
    };
  }
}
