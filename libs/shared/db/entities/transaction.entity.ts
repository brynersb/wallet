import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AccountEntity } from './account.entity';
import { TransactionType } from '../../../domain/wallet/enums/transaction-type.enum';

@Entity()
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AccountEntity, (account) => account.transactions)
  account: AccountEntity;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
