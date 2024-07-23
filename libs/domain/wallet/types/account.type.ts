import { TransactionType } from '../enums/transaction-type.enum';

export type AccountBalnce = {
  balance: number;
};

export type AccountSummary = {
  balance: number;

  transactions: TransactionResponse[];
};

export type TransactionResponse = {
  id: string;

  accountId: string;

  type: TransactionType;

  amount: number;

  status: string;

  createdAt: Date;

  updatedAt: Date;
};

export type AccountCreatedResponse = {
  accountId: string;
  name: string;
  email: string;
};
