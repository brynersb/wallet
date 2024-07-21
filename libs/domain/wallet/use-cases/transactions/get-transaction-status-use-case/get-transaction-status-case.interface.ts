import { BusinessError } from '../../../../common/types/business-error';
import { TransactionEntityDomain } from '../../../entities/transaction-entity-domain';

export interface GetTransactionStatusUseCaseInterface {
  execute(transactionId: string): Promise<TransactionEntityDomain | BusinessError>;
}
