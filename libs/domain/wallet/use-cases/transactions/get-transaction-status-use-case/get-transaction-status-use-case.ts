import { LoggerServiceInterface } from '../../../../common/services/logger/logger.service.interface';
import { BusinessError } from '../../../../common/types/business-error';
import { TransactionEntityDomain } from '../../../entities/transaction-entity-domain';
import { TransactionRepositoryInterface } from '../../../repositories/transaction.repository.interface';
import TransactionErrorKey from '../../../utils/transaction-error-key';
import { GetTransactionStatusUseCaseInterface } from './get-transaction-status-case.interface';

export class GetTransactionStatusUseCase implements GetTransactionStatusUseCaseInterface {
  private errorMessage: string;
  constructor(
    private readonly loggerService: LoggerServiceInterface,
    private readonly transactionRepository: TransactionRepositoryInterface,
  ) {}
  async execute(transactionId: string): Promise<TransactionEntityDomain | BusinessError> {
    try {
      this.loggerService.log(`Start get transaction status:${transactionId}`);
      const transactionFinded = await this.transactionRepository.findById(transactionId);

      if (!transactionFinded) {
        this.errorMessage = `Transaction not found: transactionId:${transactionId}`;
        this.loggerService.error(this.errorMessage);
        return new BusinessError(TransactionErrorKey.trasactionNotFound, this.errorMessage);
      }

      this.loggerService.log(`Succesfully get transaction status:${JSON.stringify(transactionFinded)}`);
      return transactionFinded;
    } catch (error) {
      this.errorMessage = `An error has occurred while get transaction by id, error:${error.message}`;
      this.loggerService.error(this.errorMessage);
      return new BusinessError(TransactionErrorKey.findTrasactionByIdGeneralError, this.errorMessage);
    }
  }
}
