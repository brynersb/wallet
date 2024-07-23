import { Provider } from '@nestjs/common';
import { LoggerServiceInterface } from '../../../../libs/domain/common/services/logger/logger.service.interface';
import { TransactionRepositoryInterface } from '../../../../libs/domain/wallet/repositories/transaction.repository.interface';
import { AccountRepositoryInterface } from '../../../../libs/domain/wallet/repositories/account.repository.interface';
import { CancellationOrRefundUseCase } from '../../../../libs/domain/wallet/use-cases/transactions/cancallation-or-refund-use-case/cancellation-or-refund-use-case';

export const CancallationOrRefundAmountProvider = {
  provide: 'CancellationOrRefundUseCaseInterface',
  useFactory: (
    loggerService: LoggerServiceInterface,
    transactionRepository: TransactionRepositoryInterface,
    accountRepository: AccountRepositoryInterface,
  ) => {
    return new CancellationOrRefundUseCase(loggerService, transactionRepository, accountRepository);
  },
  inject: ['LoggerServiceInterface', 'TransactionRepositoryInterface', 'AccountRepositoryInterface'],
} as Provider;
