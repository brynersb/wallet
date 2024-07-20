import { TransactionType } from '../../../../libs/domain/wallet/enums/transaction-type.enum';

export class TransactionsResponseDto {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}
