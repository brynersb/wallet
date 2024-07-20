import { TransactionType } from '../../enums/transaction-type.enum';

export type TransactionOperation = {
  transactionId: string;
  accnountId: string;
  amount: number;
};

export type TransactionOperationRequest = {
  accountId: string;
  type: TransactionType;
  customerId: string;
  amount: number;
};
