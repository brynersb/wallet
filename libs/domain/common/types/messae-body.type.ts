import { TransactionType } from '../../wallet/enums/transaction-type.enum';

export type MessageBody = {
  messageId?: string;
  transactionId: string;
  accauntId: string;
  transactionType: TransactionType;
  amount: number;
};
