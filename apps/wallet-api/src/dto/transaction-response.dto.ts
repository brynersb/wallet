import { TransactionType } from '../../../../libs/domain/wallet/enums/transaction-type.enum';

export class TransactionsResponseDto {
  accountId: string;
  type: TransactionType;
  amount: number;
  created_at: Date;
}
