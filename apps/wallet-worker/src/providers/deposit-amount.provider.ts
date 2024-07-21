import { Provider } from '@nestjs/common';
import { LoggerServiceInterface } from '../../../../libs/domain/common/services/logger/logger.service.interface';
import { TransactionRepositoryInterface } from '../../../../libs/domain/wallet/repositories/transaction.repository.interface';
import { AccountRepositoryInterface } from '../../../../libs/domain/wallet/repositories/account.repository.interface';
import { DepositAmountUseCase } from '../../../../libs/domain/wallet/use-cases/transactions/deposit-amount-use-case/deposit-amount-use-case';

export const DepositAmountProvider = {
  provide: 'DepositAmounttUseCaseInterface',
  useFactory: (
    loggerService: LoggerServiceInterface,
    transactionRepository: TransactionRepositoryInterface,
    accountRepository: AccountRepositoryInterface,
  ) => {
    return new DepositAmountUseCase(loggerService, transactionRepository, accountRepository);
  },
  inject: ['LoggerServiceInterface', 'TransactionRepositoryInterface', 'AccountRepositoryInterface'],
} as Provider;
