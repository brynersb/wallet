import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from '../../../db/entities/transaction.entity';
import {
  FindAllTransactionFilter,
  TransactionRepositoryInterface,
} from '../../../../domain/wallet/repositories/transaction.repository.interface';
import { Between, Repository } from 'typeorm';
import { TransactionEntityDomain } from '../../../../domain/wallet/entities/transaction-entity-domain';
import { TransactionMapper } from '../mappers/transaction.mapper';
import { TransactionResponse } from '../../../../domain/wallet/types/account.type';

export class TransactionRepository implements TransactionRepositoryInterface {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  async findById(transactionId: string): Promise<TransactionEntityDomain> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
      relations: ['account'],
    });
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

  async findAll(accountId: string, filter: FindAllTransactionFilter): Promise<TransactionResponse[]> {
    const { startDate, endDate } = filter;

    const start = new Date(startDate);
    start.setHours(start.getHours() + 3);

    const end = new Date(endDate);
    end.setHours(end.getHours() + 3);
    const transactions = await this.transactionRepository.find({
      where: {
        account: { id: accountId },
        created_at: Between(new Date(start), new Date(end)),
      },
      order: { created_at: 'ASC' },
    });

    return transactions.map((transaction) => TransactionMapper.toSummary(transaction));
  }
}
