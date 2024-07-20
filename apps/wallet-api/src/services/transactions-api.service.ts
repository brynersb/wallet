import { Inject, Injectable } from '@nestjs/common';
import { GetTransactionStatusUseCaseInterface } from '../../../../libs/domain/wallet/transactions/use-cases/get-transaction-status-use-case/get-transaction-status-caseinterface';
import { TransactionOperationRequest } from '../../../../libs/domain/wallet/transactions/types/transaction-operation-type';
import { TransactionEntityDomain } from '../../../../libs/domain/wallet/entities/transaction-entity-domain';
import { TransactionRequestUseCaseInterface } from '../../../../libs/domain/wallet/transactions/use-cases/transaction-request-use-case/transaction-request-use-caseinterface';

@Injectable()
export class TransactionsApiService {
  constructor(
    @Inject('RequestTransactionUseCaseInterface')
    private readonly transactionRequest: TransactionRequestUseCaseInterface,
    @Inject('GetTransactionStatusUseCaseInterface')
    private readonly getTransactionStatus: GetTransactionStatusUseCaseInterface,
  ) {}

  async createTransaction(transactionRequest: TransactionOperationRequest): Promise<TransactionEntityDomain> {
    return await this.transactionRequest.execute(transactionRequest);
  }
  async getTransaction(transactionId: string): Promise<TransactionEntityDomain> {
    return await this.getTransactionStatus.execute(transactionId);
  }
}
