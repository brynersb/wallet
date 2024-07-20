import Entity from '../../common/types/entity/entity';
import { AccountEntityDomain } from './account-entity-domain';

export interface CustomerProps {
  name: string;
  email: string;
  password: string;
  accounts: AccountEntityDomain[];
  createdAt: Date;
  updatedAt: Date;
}

export class CustomerEntityDomain extends Entity<CustomerProps> {
  private _name: string;
  private _email: string;
  private _password: string;
  private _accounts: AccountEntityDomain[];
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: CustomerProps, id?: string) {
    super(props, id);
    this.name = this.props.name;
    this.email = this.props.email;
    this.password = this.props.password;
    this.accounts = this.props.accounts;
    this.createdAt = this.props.createdAt;
    this.updatedAt = this.props.updatedAt;
  }

  get name(): string {
    return this._name;
  }

  private set name(value: string) {
    this._name = value;
  }

  get email(): string {
    return this._email;
  }

  private set email(value: string) {
    this._email = value;
  }

  get password(): string {
    return this._password;
  }

  private set password(value: string) {
    this._password = value;
  }

  get accounts(): AccountEntityDomain[] {
    return this._accounts;
  }

  private set accounts(value: AccountEntityDomain[]) {
    this._accounts = value;
  }

  public addAccount(account: AccountEntityDomain) {
    this._accounts.push(account);
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
