import { EventsEntityDomain, EventsProps } from './events-entity-domain';
import { AccountEntityDomain } from './account-entity-domain';
import { TransactionType } from '../enums/transaction-type.enum';

describe('EventsEntityDomain', () => {
  let account: AccountEntityDomain;
  let eventsProps: EventsProps;
  let event: EventsEntityDomain;

  beforeEach(() => {
    account = new AccountEntityDomain({
      customer: null,
      balance: 100,
      transactions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    eventsProps = {
      account: account,
      type: TransactionType.DEPOSIT,
      amount: 50,
      processed: false,
      created_at: new Date(),
      updated_at: new Date(),
    };

    event = new EventsEntityDomain(eventsProps);
  });

  it('should be created with correct properties', () => {
    expect(event.account).toBe(account);
    expect(event.type).toBe(TransactionType.DEPOSIT);
    expect(event.amount).toBe(50);
    expect(event.processed).toBe(false);
    expect(event.createdAt).toBeInstanceOf(Date);
    expect(event.updatedAt).toBeInstanceOf(Date);
  });

  it('should mark as processed', () => {
    event.markAsProcessed();
    expect(event.processed).toBe(true);
  });
});
