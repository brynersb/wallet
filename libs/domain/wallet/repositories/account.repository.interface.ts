import { AccountEntityDomain } from '../entities/account-entity-domain';

export interface AccountRepositoryInterface {
  findById(accountId: string): Promise<AccountEntityDomain>;
  create(account: AccountEntityDomain): Promise<void>;
  update(account: AccountEntityDomain): Promise<void>;
}
