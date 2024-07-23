import { AccountEntityDomain, AccountProps } from './account-entity-domain';
import { CustomerEntityDomain } from './customer-entity-domain';
import { TransactionEntityDomain } from './transaction-entity-domain';
import { TransactionType, TransactionStatus } from '../enums/transaction-type.enum';

describe('AccountEntityDomain', () => {
  let customer: CustomerEntityDomain;
  let transaction: TransactionEntityDomain;
  let accountProps: AccountProps;
  let account: AccountEntityDomain;
  let date: Date;
  beforeEach(() => {
    date = new Date();
    customer = new CustomerEntityDomain({
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: date,
      updatedAt: date,
    });

    transaction = new TransactionEntityDomain({
      account: null,
      type: TransactionType.DEPOSIT,
      amount: 50,
      status: TransactionStatus.PROCESSED,
      createdAt: date,
      updatedAt: date,
    });

    accountProps = {
      customer: customer,
      balance: 100,
      transactions: [transaction],
      createdAt: date,
      updatedAt: date,
    };

    account = new AccountEntityDomain(accountProps);
  });

  it('should be created with the correct properties', () => {
    expect(account.customer).toBe(customer);
    expect(account.balance).toBe(100);
    expect(account.transactions).toEqual([transaction]);
    expect(account.createdAt).toBe(date);
    expect(account.updatedAt).toBe(date);
  });

  it('should add an amount to the balance', () => {
    account.addAmount('50');
    expect(account.balance).toBe(150);
  });

  it('should subtract an amount from the balance', () => {
    account.subtractAmount(50);
    expect(account.balance).toBe(50);
  });

  it('should throw an error when subtracting an amount greater than the balance ', () => {
    expect(() => account.subtractAmount(200)).toThrow('Insufficient balance');
  });

  it('should add a transaction', () => {
    const newTransaction = new TransactionEntityDomain({
      account: null,
      type: TransactionType.WITHDRAWAL,
      amount: 20,
      status: TransactionStatus.PROCESSED,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    account.addTransaction(newTransaction);
    expect(account.transactions).toContain(newTransaction);
  });
});
