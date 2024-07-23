import { TransactionEntityDomain, TransactionProps } from './transaction-entity-domain';
import { AccountEntityDomain } from './account-entity-domain';
import { TransactionType, TransactionStatus } from '../enums/transaction-type.enum';

describe('TransactionEntityDomain', () => {
  let account: AccountEntityDomain;
  let transactionProps: TransactionProps;
  let transaction: TransactionEntityDomain;

  beforeEach(() => {
    account = new AccountEntityDomain({
      customer: null,
      balance: 100,
      transactions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    transactionProps = {
      account: account,
      type: TransactionType.DEPOSIT,
      amount: 50,
      status: TransactionStatus.PROCESSED,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    transaction = new TransactionEntityDomain(transactionProps);
  });

  it('should be created with correct properties', () => {
    expect(transaction.account).toBe(account);
    expect(transaction.type).toBe(TransactionType.DEPOSIT);
    expect(transaction.amount).toBe(50);
    expect(transaction.status).toBe(TransactionStatus.PROCESSED);
    expect(transaction.createdAt).toBeInstanceOf(Date);
    expect(transaction.updatedAt).toBeInstanceOf(Date);
  });

  it('should update status to PROCESSING', () => {
    transaction.updateStatusProcessing();
    expect(transaction.status).toBe(TransactionStatus.PROCESSING);
  });

  it('should update status to PROCESSED', () => {
    transaction.updateStatusProcessed();
    expect(transaction.status).toBe(TransactionStatus.PROCESSED);
  });

  it('should update status to ERROR', () => {
    transaction.updateStatusError();
    expect(transaction.status).toBe(TransactionStatus.ERROR);
  });
});
