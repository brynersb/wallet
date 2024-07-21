import { Provider } from '@nestjs/common';
import { LoggerServiceInterface } from '../../../../libs/domain/common/services/logger/logger.service.interface';
import { TransactionRepositoryInterface } from '../../../../libs/domain/wallet/repositories/transaction.repository.interface';
import { AccountRepositoryInterface } from '../../../../libs/domain/wallet/repositories/account.repository.interface';
import { WithdrawalAmountUseCase } from '../../../../libs/domain/wallet/use-cases/transactions/withdrawal-amount-use-case /withdrawal-amount-use-case';

export const WithdrawalAmountProvider = {
  provide: 'WithdrawalAmounttUseCaseInterface',
  useFactory: (
    loggerService: LoggerServiceInterface,
    transactionRepository: TransactionRepositoryInterface,
    accountRepository: AccountRepositoryInterface,
  ) => {
    return new WithdrawalAmountUseCase(loggerService, transactionRepository, accountRepository);
  },
  inject: ['LoggerServiceInterface', 'TransactionRepositoryInterface', 'AccountRepositoryInterface'],
} as Provider;
