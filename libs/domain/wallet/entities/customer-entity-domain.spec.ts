import { CustomerEntityDomain, CustomerProps } from './customer-entity-domain';
import { AccountEntityDomain } from './account-entity-domain';

describe('CustomerEntityDomain', () => {
  let account: AccountEntityDomain;
  let customerProps: CustomerProps;
  let customer: CustomerEntityDomain;

  beforeEach(() => {
    account = new AccountEntityDomain({
      customer: null,
      balance: 100,
      transactions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    customerProps = {
      name: 'John Doe',
      email: 'john@example.com',
      accounts: [account],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    customer = new CustomerEntityDomain(customerProps);
  });

  it('should be created with correct properties', () => {
    expect(customer.name).toBe('John Doe');
    expect(customer.email).toBe('john@example.com');
    expect(customer.accounts).toEqual([account]);
    expect(customer.createdAt).toBeInstanceOf(Date);
    expect(customer.updatedAt).toBeInstanceOf(Date);
  });

  it('should add an account', () => {
    const newAccount = new AccountEntityDomain({
      customer: null,
      balance: 200,
      transactions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    customer.addAccount(newAccount);
    expect(customer.accounts).toContain(newAccount);
  });
});
