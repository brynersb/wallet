import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from '../../../db/entities/transaction.entity';
import { TransactionRepositoryInterface } from '../../../../domain/wallet/repositories/transaction.repository.interface';
import { Repository } from 'typeorm';
import { TransactionEntityDomain } from '../../../../domain/wallet/entities/transaction-entity-domain';
import { TransactionMapper } from '../mappers/transaction.mapper';

export class TransactionRepository implements TransactionRepositoryInterface {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  async findById(transactionId: string): Promise<TransactionEntityDomain> {
    const transaction = await this.transactionRepository.findOne({ where: { id: transactionId } });
    return transaction ? TransactionMapper.toDomain(transaction) : null;
  }

  async create(transaction: TransactionEntityDomain): Promise<void> {
    const mappedTransaction = TransactionMapper.toRepository(transaction);
    await this.transactionRepository.save(mappedTransaction);
  }

  async update(transaction: TransactionEntityDomain): Promise<void> {
    const mappedTransaction = TransactionMapper.toRepository(transaction);
    await this.transactionRepository.update(mappedTransaction.id, mappedTransaction);
  }
}
