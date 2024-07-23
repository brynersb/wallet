import { Entity, Column, ManyToOne, OneToMany, JoinColumn, PrimaryColumn, Relation } from 'typeorm';
import { CustomerEntity } from './Customer.entity';
import { TransactionEntity } from './transaction.entity';

@Entity('account')
export class AccountEntity {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => CustomerEntity, (customer) => customer.accounts)
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity;

  @Column('decimal', { precision: 10, scale: 2 })
  balance: number;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.account)
  transactions: Relation<TransactionEntity>[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
