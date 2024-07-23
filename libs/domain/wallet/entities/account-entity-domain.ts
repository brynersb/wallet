import { CustomerEntityDomain } from './customer-entity-domain';
import { TransactionEntityDomain } from './transaction-entity-domain';
import Entity from '../../common/types/entity/entity';

export interface AccountProps {
  customer?: CustomerEntityDomain;
  balance: number;
  transactions?: TransactionEntityDomain[];
  createdAt: Date;
  updatedAt: Date;
}

export class AccountEntityDomain extends Entity<AccountProps> {
  private _customer: CustomerEntityDomain;
  private _balance: number;
  private _transactions: TransactionEntityDomain[];
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: AccountProps, id?: string) {
    super(props, id);
    this.customer = this.props.customer;
    this.balance = this.props.balance;
    this.transactions = this.props.transactions;
    this.createdAt = this.props.createdAt;
    this.updatedAt = this.props.updatedAt;
  }

  get customer(): CustomerEntityDomain {
    return this._customer;
  }

  private set customer(value: CustomerEntityDomain) {
    this._customer = value;
  }

  get balance(): number {
    return this._balance;
  }

  private set balance(value: number) {
    this._balance = value;
  }

  public addAmount(amount: string) {
    this._balance += parseFloat(amount);
  }

  public subtractAmount(amount: number) {
    if (amount > this._balance) {
      throw new Error('Insufficient balance');
    }
    this._balance -= amount;
  }

  get transactions(): TransactionEntityDomain[] {
    return this._transactions;
  }

  private set transactions(value: TransactionEntityDomain[]) {
    this._transactions = value;
  }

  public addTransaction(transaction: TransactionEntityDomain) {
    this._transactions.push(transaction);
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  private set createdAt(value: Date) {
    this._createdAt = value;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  private set updatedAt(value: Date) {
    this._updatedAt = value;
  }
}
