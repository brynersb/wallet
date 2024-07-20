import { TransactionEntityDomain } from '../../../entities/transaction-entity-domain';
import { TransactionOperationRequest } from '../../types/transaction-operation-type';

export interface TransactionRequestUseCaseInterface {
  execute(request: TransactionOperationRequest): Promise<TransactionEntityDomain>;
}
