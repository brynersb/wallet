import { Provider } from '@nestjs/common';
import { LoggerServiceInterface } from '../../../../libs/domain/common/services/logger/logger.service.interface';
import { SQSProducerServiceInterface } from '../../../../libs/shared/src/common/services/sqs/sqs-producer/sqs-producer.service.interface';
import { TransactionRepositoryInterface } from '../../../../libs/domain/wallet/repositories/transaction.repository.interface';
import { AccountRepositoryInterface } from '../../../../libs/domain/wallet/repositories/account.repository.interface';
import { TransactionRequestUseCase } from '../../../../libs/domain/wallet/transactions/use-cases/transaction-request-use-case/transaction-request-use-case';

export const TransactionRequestProvider = {
  provide: 'RequestTransactionUseCaseInterface',
  useFactory: (
    loggerService: LoggerServiceInterface,
    transactionRepository: TransactionRepositoryInterface,
    accountRepository: AccountRepositoryInterface,
    sqsProducer: SQSProducerServiceInterface,
  ) => {
    return new TransactionRequestUseCase(loggerService, transactionRepository, accountRepository, sqsProducer);
  },
  inject: [
    'LoggerServiceInterface',
    'TransactionRepositoryInterface',
    'AccountRepositoryInterface',
    'SQSProducerServiceInterface',
  ],
} as Provider;
