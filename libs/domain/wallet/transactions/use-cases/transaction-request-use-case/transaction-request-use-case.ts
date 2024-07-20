import { SQSProducerServiceInterface } from '../../../../../shared/src/common/services/sqs/sqs-producer/sqs-producer.service.interface';
import { LoggerServiceInterface } from '../../../../common/services/logger/logger.service.interface';
import { MessageBody } from '../../../../common/types/messae-body.type';
import { TransactionEntityDomain } from '../../../entities/transaction-entity-domain';
import { AccountRepositoryInterface } from '../../../repositories/account.repository.interface';
import { TransactionRepositoryInterface } from '../../../repositories/transaction.repository.interface';
import { TransactionOperationRequest } from '../../types/transaction-operation-type';
import { TransactionRequestUseCaseInterface } from './transaction-request-use-caseinterface';

export class TransactionRequestUseCase implements TransactionRequestUseCaseInterface {
  constructor(
    private readonly loggerService: LoggerServiceInterface,
    private readonly transactionRepository: TransactionRepositoryInterface,
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly sqsProducer: SQSProducerServiceInterface,
  ) {}
  async execute(request: TransactionOperationRequest): Promise<TransactionEntityDomain> {
    try {
      this.loggerService.log(`Start process transaction for accountId:${request.accountId}`);
      const findedAccount = await this.accountRepository.findById(request.accountId);
      if (!findedAccount) {
        const errorMessage = `Account not found, accountId:${request.accountId}`;
        this.loggerService.error(errorMessage);
        throw new Error(errorMessage);
      }

      const transaction = new TransactionEntityDomain({
        account: findedAccount,
        type: request.type,
        amount: request.amount,
        created_at: new Date(),
        updated_at: new Date(),
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
      this.loggerService.error(`An error has occurred while requesting transaction, error:${error.message}`);
    }
  }
}
