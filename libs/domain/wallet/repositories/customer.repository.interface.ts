import { CustomerEntityDomain } from '../entities/customer-entity-domain';

export interface CustomerRepositoryInterface {
  create(customer: CustomerEntityDomain): Promise<void>;
}
