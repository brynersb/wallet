import Entity from '../../common/types/entity/entity';
import { TransactionType } from '../enums/transaction-type.enum';
import { AccountEntityDomain } from './account-entity-domain';

export interface TransactionProps {
  account: AccountEntityDomain;
  type: TransactionType;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export class TransactionEntityDomain extends Entity<TransactionProps> {
  private _account: AccountEntityDomain;
  private _type: TransactionType;
  private _amount: number;
  private _status: string;
  private _date: Date;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: TransactionProps, id?: string) {
    super(props, id);
    this.account = this.props.account;
    this.type = this.props.type;
    this.amount = this.props.amount;
    this.status = this.props.status;
    this.createdAt = this.props.createdAt;
    this.updatedAt = this.props.updatedAt;
  }

  get account(): AccountEntityDomain {
    return this._account;
  }

  private set account(value: AccountEntityDomain) {
    this._account = value;
  }

  get type(): TransactionType {
    return this._type;
  }

  private set type(value: TransactionType) {
    this._type = value;
  }

  get amount(): number {
    return this._amount;
  }

  private set amount(value: number) {
    this._amount = value;
  }

  get status(): string {
    return this._status;
  }

  private set status(value: string) {
    this._status = value;
  }

  get date(): Date {
    return this._date;
  }

  private set date(value: Date) {
    this._date = value;
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
