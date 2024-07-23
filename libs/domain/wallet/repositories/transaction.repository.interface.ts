import { TransactionEntityDomain } from '../entities/transaction-entity-domain';
import { TransactionResponse } from '../types/account.type';

export type FindAllTransactionFilter = {
  startDate: string;
  endDate: string;
};
export interface TransactionRepositoryInterface {
  findById(transactionId: string): Promise<TransactionEntityDomain>;
  create(transaction: TransactionEntityDomain): Promise<void>;
  update(transaction: TransactionEntityDomain): Promise<void>;
  findAll(accountId: string, filter: FindAllTransactionFilter): Promise<TransactionResponse[]>;
}
