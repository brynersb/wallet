import { AccountEntityDomain } from '../../../../domain/wallet/entities/account-entity-domain';
import { AccountEntity } from '../../../db/entities/account.entity';
import { CustomerMapper } from './customer.mapper';
import { TransactionMapper } from './transaction.mapper';

export class AccountMapper {
  static toDomain(accountEntity: AccountEntity): AccountEntityDomain {
    return new AccountEntityDomain(
      {
        customer: accountEntity.customer ? CustomerMapper.toDomain(accountEntity.customer) : undefined,
        balance: accountEntity.balance,
        transactions: accountEntity.transactions
          ? accountEntity.transactions.map((transaction) => TransactionMapper.toDomain(transaction))
          : undefined,
        createdAt: accountEntity.created_at,
        updatedAt: accountEntity.updated_at,
      },
      accountEntity.id,
    );
  }

  static toRepository(accountDomain: AccountEntityDomain): AccountEntity {
    const accountEntity = new AccountEntity();
    accountEntity.id = accountDomain.id;
    accountEntity.customer = accountDomain.customer ? CustomerMapper.toRepository(accountDomain.customer) : undefined;
    accountEntity.balance = accountDomain.balance;
    accountEntity.transactions = accountDomain.transactions
      ? accountDomain.transactions.map((transaction) => TransactionMapper.toRepository(transaction))
      : undefined;
    accountEntity.created_at = accountDomain.createdAt;
    accountEntity.updated_at = accountDomain.updatedAt;
    return accountEntity;
  }
}
