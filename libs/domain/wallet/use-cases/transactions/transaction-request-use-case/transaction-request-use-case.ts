import { SQSProducerServiceInterface } from '../../../../../shared/src/common/services/sqs/sqs-producer/sqs-producer.service.interface';
import { LoggerServiceInterface } from '../../../../common/services/logger/logger.service.interface';
import { BusinessError } from '../../../../common/types/business-error';
import { MessageBody } from '../../../../common/types/messae-body.type';
import { TransactionEntityDomain } from '../../../entities/transaction-entity-domain';
import { AccountRepositoryInterface } from '../../../repositories/account.repository.interface';
import { TransactionRepositoryInterface } from '../../../repositories/transaction.repository.interface';
import TransactionErrorKey from '../../../utils/transaction-error-key';
import { TransactionOperationRequest } from '../../../types/transaction-operation-type';
import { TransactionRequestUseCaseInterface } from './transaction-request-use-case.interface';

export class TransactionRequestUseCase implements TransactionRequestUseCaseInterface {
  private errorMessage: string;
  constructor(
    private readonly loggerService: LoggerServiceInterface,
    private readonly transactionRepository: TransactionRepositoryInterface,
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly sqsProducer: SQSProducerServiceInterface,
  ) {}
  async execute(request: TransactionOperationRequest): Promise<TransactionEntityDomain | BusinessError> {
    try {
      this.loggerService.log(`Start process transaction for accountId:${request.accountId}`);
      const findedAccount = await this.accountRepository.findById(request.accountId);
      if (!findedAccount) {
        this.errorMessage = `Account not found, accountId:${request.accountId}`;
        this.loggerService.error(this.errorMessage);
        return new BusinessError(TransactionErrorKey.accountNotFound, this.errorMessage);
      }

      const transaction = new TransactionEntityDomain({
        account: findedAccount,
        status: 'PROCESSING',
        type: request.type,
        amount: request.amount,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await this.transactionRepository.create(transaction);

      const transactionRequestMessage: MessageBody = {
        transactionId: transaction.id,
        accnountId: findedAccount.id,
        transactionType: transaction.type,
        amount: transaction.amount,
      };
      await this.sqsProducer.sendMessage(transactionRequestMessage);

      return transaction;
    } catch (error) {
      this.errorMessage = `An error has occurred while requesting transaction, error:${error.message}`;
      this.loggerService.error(this.errorMessage);
      return new BusinessError(TransactionErrorKey.requestTrasactionGeneralError, this.errorMessage);
    }
  }
}
