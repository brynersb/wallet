import { TransactionsResponseDto } from '../../../../../apps/wallet-api/src/dto/transaction-response.dto';
import { TransactionEntityDomain } from '../../../../domain/wallet/entities/transaction-entity-domain';
import { TransactionResponse } from '../../../../domain/wallet/types/account.type';
import { TransactionEntity } from '../../../db/entities/transaction.entity';
import { AccountMapper } from './account.mapper';

export class TransactionMapper {
  static toDomain(transactionEntity: TransactionEntity): TransactionEntityDomain {
    return new TransactionEntityDomain(
      {
        account: transactionEntity.account ? AccountMapper.toDomain(transactionEntity.account) : undefined,
        status: transactionEntity.status,
        amount: transactionEntity.amount,
        type: transactionEntity.type,
        createdAt: transactionEntity.created_at,
        updatedAt: transactionEntity.updated_at,
      },
      transactionEntity.id,
    );
  }

  static toRepository(transactionDomain: TransactionEntityDomain): TransactionEntity {
    const transactionEntity = new TransactionEntity();
    transactionEntity.id = transactionDomain.id;
    transactionEntity.account = transactionDomain.account
      ? AccountMapper.toRepository(transactionDomain.account)
      : undefined;
    transactionEntity.amount = transactionDomain.amount;
    transactionEntity.type = transactionDomain.type;
    transactionEntity.status = transactionDomain.status;
    transactionEntity.created_at = transactionDomain.createdAt;
    transactionEntity.updated_at = transactionDomain.updatedAt;
    return transactionEntity;
  }

  static toResponse(transactionDomain: TransactionEntityDomain): TransactionsResponseDto {
    return {
      id: transactionDomain.id,
      accountId: transactionDomain.account?.id,
      type: transactionDomain.type,
      amount: transactionDomain.amount,
      status: transactionDomain.status,
      createdAt: transactionDomain.createdAt,
      updatedAt: transactionDomain.updatedAt,
    };
  }

  static toSummary(transactionDomain: TransactionEntity): TransactionResponse {
    return {
      id: transactionDomain.id,
      accountId: transactionDomain.account?.id,
      type: transactionDomain.type,
      amount: transactionDomain.amount,
      status: transactionDomain.status,
      createdAt: transactionDomain.created_at,
      updatedAt: transactionDomain.updated_at,
    };
  }
}
