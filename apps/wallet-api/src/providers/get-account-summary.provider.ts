import { Provider } from '@nestjs/common';
import { LoggerServiceInterface } from '../../../../libs/domain/common/services/logger/logger.service.interface';
import { AccountRepositoryInterface } from '../../../../libs/domain/wallet/repositories/account.repository.interface';
import { GetAccountSummaryUseCase } from '../../../../libs/domain/wallet/use-cases/account/get-account-summary-use-case/get-account-summary-use-case';
import { TransactionRepositoryInterface } from '../../../../libs/domain/wallet/repositories/transaction.repository.interface';

export const GetAccountSummaryProvider = {
  provide: 'GetAccountSummaryUseCaseInterface',
  useFactory: (
    loggerService: LoggerServiceInterface,
    accountRepository: AccountRepositoryInterface,
    transactionRepository: TransactionRepositoryInterface,
  ) => {
    return new GetAccountSummaryUseCase(loggerService, accountRepository, transactionRepository);
  },
  inject: ['LoggerServiceInterface', 'AccountRepositoryInterface', 'TransactionRepositoryInterface'],
} as Provider;
