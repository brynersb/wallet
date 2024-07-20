import { CustomerEntityDomain } from './customer-entity-domain';
import { TransactionEntityDomain } from './transaction-entity-domain';
import { EventsEntityDomain } from './events-entity-domain';
import Entity from '../../common/types/entity/entity';

export interface AccountProps {
  customer: CustomerEntityDomain;
  balance: number;
  transactions: TransactionEntityDomain[];
  events: EventsEntityDomain[];
  created_at: Date;
  updated_at: Date;
}

export class AccountEntityDomain extends Entity<AccountProps> {
  private _customer: CustomerEntityDomain;
  private _balance: number;
  private _transactions: TransactionEntityDomain[];
  private _events: EventsEntityDomain[];
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: AccountProps, id?: string) {
    super(props, id);
    this.customer = this.props.customer;
    this.balance = this.props.balance;
    this.transactions = this.props.transactions;
    this.events = this.props.events;
    this._createdAt = this.props.created_at;
    this._updatedAt = this.props.updated_at;
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

  public updateBalance(amount: number) {
    this._balance += amount;
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

  get events(): EventsEntityDomain[] {
    return this._events;
  }

  private set events(value: EventsEntityDomain[]) {
    this._events = value;
  }

  public addEvent(event: EventsEntityDomain) {
    this._events.push(event);
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
