import Entity from '../../common/types/entity/entity';
import { TransactionType } from '../enums/transaction-type.enum';
import { AccountEntityDomain } from './account-entity-domain';

export interface EventsProps {
  account: AccountEntityDomain;
  type: TransactionType;
  amount: number;
  processed: boolean;
  created_at: Date;
  updated_at: Date;
}

export class EventsEntityDomain extends Entity<EventsProps> {
  private _account: AccountEntityDomain;
  private _type: TransactionType;
  private _amount: number;
  private _processed: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: EventsProps, id?: string) {
    super(props, id);
    this.account = this.props.account;
    this.type = this.props.type;
    this.amount = this.props.amount;
    this.processed = this.props.processed;
    this._createdAt = this.props.created_at;
    this._updatedAt = this.props.updated_at;
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

  get processed(): boolean {
    return this._processed;
  }

  private set processed(value: boolean) {
    this._processed = value;
  }

  public markAsProcessed() {
    this._processed = true;
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
