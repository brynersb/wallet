import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AccountEntity } from './account.entity';
import { TransactionType } from '../../../domain/wallet/enums/transaction-type.enum';

@Entity()
export class EventsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AccountEntity, (account) => account.events)
  account: AccountEntity;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  processed: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
