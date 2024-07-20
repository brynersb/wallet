import { TransactionEntityDomain } from '../../../entities/transaction-entity-domain';

export interface GetTransactionStatusUseCaseInterface {
  execute(transactionId: string): Promise<TransactionEntityDomain>;
}
