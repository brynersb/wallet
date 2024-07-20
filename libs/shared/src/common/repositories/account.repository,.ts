import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from '../../../db/entities/account.entity';
import { AccountMapper } from '../mappers/account.mapper';
import { AccountEntityDomain } from '../../../../domain/wallet/entities/account-entity-domain';
import { AccountRepositoryInterface } from '../../../../domain/wallet/repositories/account.repository.interface';

export class AccountRepository implements AccountRepositoryInterface {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}
  async findById(accountId: string): Promise<AccountEntityDomain> {
    const account = await this.accountRepository.findOne({ where: { id: accountId } });
    return AccountMapper.toDomain(account);
  }
  async create(account: AccountEntityDomain): Promise<void> {
    const mappedAccount = AccountMapper.toRepository(account);
    await this.accountRepository.save(mappedAccount);
  }
}
