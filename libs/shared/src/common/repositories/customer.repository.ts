import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from '../../../db/entities/Customer.entity';
import { CustomerMapper } from '../mappers/customer.mapper';
import { CustomerEntityDomain } from '../../../../domain/wallet/entities/customer-entity-domain';
import { CustomerRepositoryInterface } from '../../../../domain/wallet/repositories/customer.repository.interface';

export class CustomerRepository implements CustomerRepositoryInterface {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}
  async findById(customerId: string): Promise<CustomerEntityDomain> {
    const customer = await this.customerRepository.findOne({ where: { id: customerId } });
    return customer ? CustomerMapper.toDomain(customer) : null;
  }
  async create(customer: CustomerEntityDomain): Promise<void> {
    const mappedCustomer = CustomerMapper.toRepository(customer);
    await this.customerRepository.save(mappedCustomer);
  }

  async update(customer: CustomerEntityDomain): Promise<void> {
    const mappedCustomer = CustomerMapper.toRepository(customer);
    await this.customerRepository.update(mappedCustomer.id, mappedCustomer);
  }
}
