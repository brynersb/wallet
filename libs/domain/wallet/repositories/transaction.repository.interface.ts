import { TransactionEntityDomain } from '../entities/transaction-entity-domain';

export interface TransactionRepositoryInterface {
  findById(transactionId: string): Promise<TransactionEntityDomain>;
  create(transaction: TransactionEntityDomain): Promise<void>;
  update(transaction: TransactionEntityDomain): Promise<void>;
}
