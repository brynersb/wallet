import { Provider } from '@nestjs/common';
import { LoggerServiceInterface } from '../../../../libs/domain/common/services/logger/logger.service.interface';
import { TransactionRepositoryInterface } from '../../../../libs/domain/wallet/repositories/transaction.repository.interface';
import { GetTransactionStatusUseCase } from '../../../../libs/domain/wallet/transactions/use-cases/get-transaction-status-use-case/get-transaction-status-use-case';

export const GetTransactionStatusProvider = {
  provide: 'RequestTransactionUseCaseInterface',
  useFactory: (loggerService: LoggerServiceInterface, transactionRepository: TransactionRepositoryInterface) => {
    return new GetTransactionStatusUseCase(loggerService, transactionRepository);
  },
  inject: ['LoggerServiceInterface', 'TransactionRepositoryInterface'],
} as Provider;
