import { TransactionType } from '../../wallet/enums/transaction-type.enum';

export type MessageBody = {
  transactionId: string;
  accnountId: string;
  transactionType: TransactionType;
  amount: number;
};
