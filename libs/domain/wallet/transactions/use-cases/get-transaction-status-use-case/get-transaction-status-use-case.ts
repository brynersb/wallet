import { LoggerServiceInterface } from '../../../../common/services/logger/logger.service.interface';
import { TransactionEntityDomain } from '../../../entities/transaction-entity-domain';
import { TransactionRepositoryInterface } from '../../../repositories/transaction.repository.interface';
import { GetTransactionStatusUseCaseInterface } from './get-transaction-status-caseinterface';

export class GetTransactionStatusUseCase implements GetTransactionStatusUseCaseInterface {
  constructor(
    private readonly loggerService: LoggerServiceInterface,
    private readonly transactionRepository: TransactionRepositoryInterface,
  ) {}
  async execute(transactionId: string): Promise<TransactionEntityDomain> {
    try {
      this.loggerService.log(`Start get transaction status:${transactionId}`);
      const transactionFinded = await this.transactionRepository.findById(transactionId);
      if (!transactionFinded) {
        const errorMessage = `Transaction not found: transactionId:${transactionId}`;
        this.loggerService.error(errorMessage);
        throw new Error(errorMessage);
      }

      return transactionFinded;
    } catch (error) {
      this.loggerService.error(`An error has occurred while requesting transaction, error:${error.message}`);
    }
  }
}
