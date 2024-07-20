import { CustomerEntityDomain } from '../../../../domain/wallet/entities/customer-entity-domain';
import { CustomerEntity } from '../../../db/entities/Customer.entity';
import { AccountMapper } from './account.mapper';

export class CustomerMapper {
  static toDomain(customerEntity: CustomerEntity): CustomerEntityDomain {
    return new CustomerEntityDomain(
      {
        name: customerEntity.name,
        email: customerEntity.email,
        password: customerEntity.password,
        accounts: customerEntity.accounts.map((account) => AccountMapper.toDomain(account)),
        createdAt: customerEntity.created_at,
        updatedAt: customerEntity.updated_at,
      },
      customerEntity.id,
    );
  }

  static toRepository(customerDomain: CustomerEntityDomain): CustomerEntity {
    const customerEntity = new CustomerEntity();
    customerEntity.id = customerDomain.id;
    customerEntity.name = customerDomain.name;
    customerEntity.email = customerDomain.email;
    customerEntity.password = customerDomain.password;
    customerEntity.accounts = customerDomain.accounts.map((account) => AccountMapper.toRepository(account));
    customerEntity.created_at = customerDomain.createdAt;
    customerEntity.updated_at = customerDomain.updatedAt;
    return customerEntity;
  }
}
